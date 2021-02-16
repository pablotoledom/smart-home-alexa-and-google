const request = require("request");
const irDevices = require('../../utilities/ir-devices.json');

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

// console.log(irDevices["LG-UH6030"]);
const createIrCommand = (irDevice, index) => {
  if (typeof irDevice[index] === 'object') {
    const bits = irDevice[index].data && irDevice[index].data.split('x')[1].length * 4;
    return `IRsend {"Protocol":"${irDevice[index].Protocol}","Bits":${bits},"Data":"${irDevice[index].data}"}`; 
  } else if (typeof irDevice[index] === 'string') {
    const bits = irDevice[index].split('x')[1].length * 4;
    return `IRsend {"Protocol":"${irDevice.Protocol}","Bits":${bits},"Data":"${irDevice[index]}"}`; 
  }

  return undefined;
};

const tasmota = (device, hub, newData) => {
  let command;
  let repeat = 1;

  switch (hub.technologyType) {
    case 'RF433': {
      switch (device.type) {
        case "action.devices.types.LIGHT": {
          const OnOff = device.states.on === true ? "1" : "0";
          command = `Backlog RfRaw ${OnOff === "1" ? device.hubInformation.dataON : device.hubInformation.dataOFF }; RfRaw 0;`;
          break;
        }

        default: {
          break;
        }
      }
      
      break;
    }

    case 'IR': {
      switch (device.type) {
        case "action.devices.types.AC_UNIT": {
          let fanSpeed;

          switch (device.states.currentFanSpeedSetting) {
            case "slow_key":
              fanSpeed = "min";
              break;

            case "high_key":
              fanSpeed = "max";
              break;

            default:
              fanSpeed = "medium";
              break;
          }

          command = `IRhvac {"Vendor":"${device.hubInformation.channel}", "Power":"${device.states.on ? "On" : "Off"}","Mode":"${device.states.thermostatMode}","FanSpeed":"${fanSpeed}","Temp":${device.states.thermostatTemperatureSetpoint}}`;
          break;
        }
          
      
        default: {
          const myIrDevice = irDevices[device.hubInformation.channel];
          
          switch (device.states.lastCommand) {
            case 'mute': {
              command = createIrCommand(myIrDevice, 'Mute');
              break;
            }

            case 'volumeRelative': {
              const diferencia = device.states.currentVolume - device.states.previousVolume;
              repeat = Math.abs(diferencia);
              if (diferencia > 0) {
                command = createIrCommand(myIrDevice, 'Vol+');
              } else if (diferencia < 0) {
                command = createIrCommand(myIrDevice, 'Vol-');
              }

              break;
            }

            case 'OnOff': {
              if (device.states.on) {
                command = createIrCommand(myIrDevice, 'On');
              } else {
                command = createIrCommand(myIrDevice, 'Off');
              }
              break;
            }

            case 'SetInput': {
              switch (device.states.currentInput) {
                case 'CD':
                  command = createIrCommand(myIrDevice, 'CD');
                  break;

                case 'USB DAC':
                  command = createIrCommand(myIrDevice, 'USB');
                  break;

                case 'TUNER':
                  command = createIrCommand(myIrDevice, 'FM');
                  break;

                case 'AUX 1':
                  command = createIrCommand(myIrDevice, 'AudioIn');
                  break;

                case 'MEDIA PLAYER':
                  command = createIrCommand(myIrDevice, 'Bluetooth');
                  break;

                case 'LINE 1':
                  command = createIrCommand(myIrDevice, 'Channel1');
                  break;

                case 'LINE 2':
                  command = createIrCommand(myIrDevice, 'Channel2');
                  break;

                case 'LINE 3':
                  command = createIrCommand(myIrDevice, 'Channel3');
                  break;

                case 'HDMI 1':
                  command = createIrCommand(myIrDevice, 'HDMI1');
                  break;

                case 'HDMI 2':
                  command = createIrCommand(myIrDevice, 'HDMI2');
                  break;

                case 'HDMI 3':
                  command = createIrCommand(myIrDevice, 'HDMI3');
                  break;

                case 'VIDEO 1':
                  command = createIrCommand(myIrDevice, 'AV1');
                  break;

                case 'VIDEO 2':
                  command = createIrCommand(myIrDevice, 'AV2');
                  break;
              
                default:
                  break;
              }
              break;
            }

            case 'mediaStop': {
                command = createIrCommand(myIrDevice, 'Stop');
              break;
            }

            case 'mediaPrevious': {
              command = createIrCommand(myIrDevice, 'Previous');
              break;
            }

            case 'mediaNext': {
              command = createIrCommand(myIrDevice, 'Next');
              break;
            }

            case 'mediaPause': {
              command = createIrCommand(myIrDevice, 'Pause');
              break;
            }

            case 'mediaResume': {
              command = createIrCommand(myIrDevice, 'Play');
              break;
            }

            case 'SetModes': {
                command = createIrCommand(myIrDevice, 'Picture-mode');
              break;
            }

            case 'keystroke': {
              switch (device.states.keyPressed) {
                case 'UP': {
                  command = createIrCommand(myIrDevice, 'Up');
                  break;
                }

                case 'DOWN': {
                  command = createIrCommand(myIrDevice, 'Down');
                  break;
                }

                case 'LEFT': {
                  command = createIrCommand(myIrDevice, 'Left');
                  break;
                }

                case 'RIGHT': {
                  command = createIrCommand(myIrDevice, 'Right');
                  break;
                }

                case 'SELECT': {
                  command = createIrCommand(myIrDevice, 'Ok');
                  break;
                }

                case 'INFO': {
                  command = createIrCommand(myIrDevice, 'Info');
                  break;
                }
              
                default:
                  break;
              }
            }
            
            default: {
              break;
            }
          }

          break;
        }
      }

      break;
    }
  
    default: {
      break;
    }
  }

  console.log('repeat: ', repeat, 'comand: ', command);

  for (var i = 0; i < repeat; i++) {
    request(
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        uri: `${hub.host}/cm?cmnd=${command}`,
        method: "GET",
      },
      function (err, res, body) {
        //it works!
      }
    );

    sleep(200);
  }

};

module.exports = tasmota;
