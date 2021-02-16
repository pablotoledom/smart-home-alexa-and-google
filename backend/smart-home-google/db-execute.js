const model = require('../../database/model.js');

const dbExecute = async (userId, deviceId, execution) => {
  let data;

  await model.getDevice(userId, deviceId)
		.exec()
		.then((MyDevice) => {
			data = MyDevice;	
		})	
		.catch((err) => {
			console.log('error on searching device');
      return { code: 1, text: err };
		});

  if (!data) {
    throw new Error('deviceNotFound')
  }

  const states = {
    online: true,
  };

  if (!!data && !data.states.online) {
    throw new Error('deviceOffline')
  }

  if (!!data && data.errorCode) {
    throw new Error(!!data.errorCode)
  }
  if (!!data.tfa === 'ack' && !execution.challenge) {
    throw new Error('ackNeeded')
  } else if (!!data.tfa && !execution.challenge) {
    throw new Error('pinNeeded')
  } else if (!!data.tfa && execution.challenge) {
    if (execution.challenge.pin && execution.challenge.pin !== !!data.tfa) {
      throw new Error('challengeFailedPinNeeded')
    }
  }
  switch (execution.command) {
    // action.devices.traits.AppSelector
    case 'action.devices.commands.appSelect': {
      const { newApplication, newApplicationName } = execution.params;
      const currentApplication = newApplication || newApplicationName;
      
      await model.updateDevice(userId, deviceId, {
        'states.currentApplication': execution.params.brightness,
        'states.lastCommand': 'appSelect',
      });

      states['currentApplication'] = currentApplication;
      break;
    }

    case 'action.devices.commands.appInstall': {
      break;
    }

    case 'action.devices.commands.appSearch': {
      break;
    }

    // action.devices.traits.ArmDisarm
    case 'action.devices.commands.ArmDisarm': {
      if (execution.params.arm !== undefined) {
        states.isArmed = execution.params.arm
      } else if (execution.params.cancel) {
        // Cancel value is in relation to the arm value
        states.isArmed = data && !data.states.isArmed
      }
      if (execution.params.armLevel) {
        await model.updateDevice(userId, deviceId, {
          'states.isArmed': states.isArmed || !!data && data.states.isArmed,
          'states.currentArmLevel': execution.params.armLevel,
          'states.lastCommand': 'ArmDisarm',
        });
        states['currentArmLevel'] = execution.params.armLevel
      } else {
        await model.updateDevice(userId, deviceId, {
          'states.isArmed': states.isArmed || !!data && data.states.isArmed,
          'states.lastCommand': 'ArmDisarm',
        });
      }
      break;
    }

    // action.devices.traits.Brightness
    case 'action.devices.commands.BrightnessAbsolute': {
      await model.updateDevice(userId, deviceId, {
        'states.brightness': execution.params.brightness,
        'states.lastCommand': 'BrightnessAbsolute',
      })
      states['brightness'] = execution.params.brightness
      break;
    }

    // action.devices.traits.CameraStream
    case 'action.devices.commands.GetCameraStream': {
      states['cameraStreamAccessUrl'] = 'https://fluffysheep.com/baaaaa.mp4'
      break;
    }

    // action.devices.traits.ColorSetting
    case 'action.devices.commands.ColorAbsolute': {
      let color = {}
      if (execution.params.color.spectrumRGB) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            spectrumRgb: execution.params.color.spectrumRGB,
          },
          'states.lastCommand': 'ColorAbsolute',
        })
        color = {
          spectrumRgb: execution.params.color.spectrumRGB,
        }
      } else if (execution.params.color.spectrumHSV) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            spectrumHsv: execution.params.color.spectrumHSV,
          },
          'states.lastCommand': 'ColorAbsolute',
        })
        color = {
          spectrumHsv: execution.params.color.spectrumHSV,
        }
      } else if (execution.params.color.temperature) {
        await model.updateDevice(userId, deviceId, {
          'states.color': {
            temperatureK: execution.params.color.temperature,
          },
          'states.lastCommand': 'ColorAbsolute',
        })
        color = {
          temperatureK: execution.params.color.temperature,
        }
      } else {
        throw new Error('notSupported')
      }
      states['color'] = color
      break;
    }

    // action.devices.traits.Cook
    case 'action.devices.commands.Cook': {
      if (execution.params.start) {
        const {cookingMode, foodPreset, quantity, unit} = execution.params;
        // Start cooking      
        await model.updateDevice(userId, deviceId, {
          'states.currentCookingMode': cookingMode,
          'states.currentFoodPreset': foodPreset || 'NONE',
          'states.currentFoodQuantity': quantity || 0,
          'states.currentFoodUnit': unit || 'NO_UNITS',
          'states.lastCommand': 'Cook',
        });

        states['currentCookingMode'] = cookingMode;
        states['currentFoodPreset'] = foodPreset;
        states['currentFoodQuantity'] = quantity;
        states['currentFoodUnit'] = unit;
      } else {
        // Done cooking, reset          
        await model.updateDevice(userId, deviceId, {
          'states.currentCookingMode': 'NONE',
          'states.currentFoodPreset': 'NONE',
          'states.currentFoodQuantity': 0,
          'states.currentFoodUnit': 'NO_UNITS',
          'states.lastCommand': 'Cook',
        });
        states['currentCookingMode'] = 'NONE';
        states['currentFoodPreset'] = 'NONE';
      }
      break;
    }
    
    // action.devices.traits.Dispense
    case 'action.devices.commands.Dispense': {
      let { amount, unit } = execution.params;
      const { item, presetName } = execution.params;
      if (presetName === 'cat food bowl') {
        // Fill in params
        amount = 4;
        unit = 'CUPS';
      }
      
      await model.updateDevice(userId, deviceId, {
        'states.dispenseItems': [
          {
            itemName: item,
            amountLastDispensed: {
              amount,
              unit,
            },
            isCurrentlyDispensing: presetName !== undefined,
          },
        ],
        'states.lastCommand': 'Dispense',
      });

      states['dispenseItems'] = [
        {
          itemName: item,
          amountLastDispensed: {
            amount,
            unit,
          },
          isCurrentlyDispensing: presetName !== undefined,
        },
      ];
      break;
    }

    // action.devices.traits.Dock
    case 'action.devices.commands.Dock': {
      // This has no parameters
      await model.updateDevice(userId, deviceId, {
        'states.isDocked': true,
        'states.lastCommand': 'Dock',
      })
      states['isDocked'] = true
      break;
    }

    // action.devices.traits.EnergyStorage
    case 'action.devices.commands.Charge': {
      await model.updateDevice(userId, deviceId, {
        'states.isCharging': execution.params.charge,
        'states.lastCommand': 'Charge',
      })
      states['isCharging'] = charge;
      break;
    }

    // action.devices.traits.FanSpeed
    case 'action.devices.commands.SetFanSpeed': {
      const { fanSpeed, fanSpeedPercent } = execution.params;

      if (fanSpeed) {
        await model.updateDevice(userId, deviceId, {
          'states.currentFanSpeedSetting': fanSpeed,
          'states.lastCommand': 'SetFanSpeed',
        });
        states['currentFanSpeedSetting'] = fanSpeed
      } else if (fanSpeedPercent) {
        await model.updateDevice(userId, deviceId, {
          'states.currentFanSpeedPercent': fanSpeedPercent,
          'states.lastCommand': 'SetFanSpeed',
        });
        states['currentFanSpeedPercent'] = fanSpeedPercent;
      }

      break;
    }

    // action.devices.traits.Reverse
    case 'action.devices.commands.Reverse': {
      await model.updateDevice(userId, deviceId, {
        'states.currentFanSpeedReverse': true,
        'states.lastCommand': 'Reverse',
      })
      break;
    }

    // action.devices.traits.Fill
    case 'action.devices.commands.Fill': {
      const {fill, fillLevel} = execution.params;
      await model.updateDevice(userId, deviceId, {
        'states.isFilled': fill,
        'states.currentFillLevel': fill ? fillLevel || 'half' : 'none',
        'states.lastCommand': 'Fill',
      })
      states['isFilled'] = fill;
      states['currentFillLevel'] = fill ? fillLevel || 'half' : 'none';
      break;
    }

    // action.devices.traits.HumiditySetting
    case 'action.devices.commands.SetHumidity': {
      await model.updateDevice(userId, deviceId, {
        'states.humiditySetpointPercent': execution.params.humidity,
        'states.lastCommand': 'SetHumidity',
      })
      states['humiditySetpointPercent'] = execution.params.humidity;
      break;
    }

    // action.devices.traits.InputSelector
    case 'action.devices.commands.SetInput': {
      await model.updateDevice(userId, deviceId, {
        'states.currentInput': execution.params.newInput,
        'states.lastCommand': 'SetInput',
      });
      states['currentInput'] = execution.params.newInput;
      break;
    }
    
    case 'action.devices.commands.PreviousInput': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const availableInputs = data.attributes.availableInputs || [];
      const { currentInput } = data.states;
      const currentInputIndex = availableInputs.findIndex(
        input => input.key === currentInput
      );
      const previousInputIndex = Math.min(currentInputIndex - 1, 0);
      await model.updateDevice(userId, deviceId, {
        'states.currentInput': availableInputs[previousInputIndex].key,
        'states.lastCommand': 'PreviousInput',
      });
      states['currentInput'] = availableInputs[previousInputIndex].key;
      break;
    }

    case 'action.devices.commands.NextInput': {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const availableInputs = data.attributes.availableInputs || [];
      const { currentInput } = data.states;
      const currentInputIndex = availableInputs.findIndex(
        input => input.key === currentInput
      );
      const nextInputIndex = Math.max(
        currentInputIndex + 1,
        availableInputs.length - 1
      );

      await model.updateDevice(userId, deviceId, {
        'states.currentInput': availableInputs[nextInputIndex].key,
        'states.lastCommand': 'NextInput',
      });
      states['currentInput'] = availableInputs[nextInputIndex].key;
      break;
    }

    // action.devices.traits.Locator
    case 'action.devices.commands.Locate': {
      await model.updateDevice(userId, deviceId, {
        'states.silent': execution.params.silent,
        'states.generatedAlert': true,
        'states.lastCommand': 'Locate',
      })
      states['generatedAlert'] = true
      break;
    }

    // action.devices.traits.LockUnlock
    case 'action.devices.commands.LockUnlock': {
      await model.updateDevice(userId, deviceId, {
        'states.isLocked': execution.params.lock,
        'states.lastCommand': 'LockUnlock',
      })
      states['isLocked'] = execution.params.lock
      break;
    }

    // action.devices.traits.Modes
    case 'action.devices.commands.SetModes': {
      const currentModeSettings = data.states.currentModeSettings;
      
      for (const mode of Object.keys(execution.params.updateModeSettings)) {
        const setting = execution.params.updateModeSettings[mode]
        currentModeSettings[mode] = setting
      }
      await model.updateDevice(userId, deviceId, {
        'states.currentModeSettings': currentModeSettings,
        'states.lastCommand': 'SetModes',
      });
      states['currentModeSettings'] = currentModeSettings
      break;
    }
    
    // action.devices.traits.NetworkControl
    case 'action.devices.commands.EnableDisableGuestNetwork': {
      await model.updateDevice(userId, deviceId, {
        'states.guestNetworkEnabled': execution.params.enable,
        'states.lastCommand': 'NetworkControl',
      })
      states['guestNetworkEnabled'] = execution.params.enable;
      break;
    }

    case 'action.devices.commands.EnableDisableNetworkProfile': {
      const { profile } = execution.params;
      if (!data.attributes.networkProfiles.includes(profile)) {
        throw new Error('networkProfileNotRecognized');
      }
      // No state change occurs
      break;
    }

    case 'action.devices.commands.TestNetworkSpeed': {
      const { testDownloadSpeed, testUploadSpeed } = execution.params;
      const {
        lastNetworkDownloadSpeedTest,
        lastNetworkUploadSpeedTest,
      } = data.states;
      if (testDownloadSpeed) {
        // Randomly generate new download speed
        lastNetworkDownloadSpeedTest.downloadSpeedMbps = (
          Math.random() * 100
        ).toFixed(1); // To one degree of precision
        lastNetworkDownloadSpeedTest.unixTimestampSec = Math.floor(
          Date.now() / 1000
        );
      }
      if (testUploadSpeed) {
        // Randomly generate new upload speed
        lastNetworkUploadSpeedTest.uploadSpeedMbps = (
          Math.random() * 100
        ).toFixed(1); // To one degree of precision
        lastNetworkUploadSpeedTest.unixTimestampSec = Math.floor(
          Date.now() / 1000
        );
      }
      await model.updateDevice(userId, deviceId, {
        'states.lastNetworkDownloadSpeedTest': lastNetworkDownloadSpeedTest,
        'states.lastNetworkUploadSpeedTest': lastNetworkUploadSpeedTest,
        'states.lastCommand': 'TestNetworkSpeed',
      });
      // This operation is asynchronous and will be pending
      throw new Error('PENDING');
    }
  
    case 'action.devices.commands.GetGuestNetworkPassword': {
      states['guestNetworkPassword'] = 'wifi-password-123';
      break;
    }

    // action.devices.traits.OnOff
    case 'action.devices.commands.OnOff': {
      await model.updateDevice(userId, deviceId, {
        'states.on': execution.params.on,
        'states.lastCommand': 'OnOff',
      });
      
      states['on'] = execution.params.on;
      break;
    }

    // action.devices.traits.OpenClose
    case 'action.devices.commands.OpenClose': {
      // Check if the device can open in multiple directions
      if (!!data && data.attributes && !!data && data.attributes.openDirection) {
        // The device can open in more than one direction
        const direction = execution.params.openDirection;
        // interface OpenState {
        //   openPercent: number,
        //   openDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'IN' | 'OUT'
        // }
        !!data && data.states.openState.forEach((state) => {
          if (state.openDirection === direction) {
            state.openPercent = execution.params.openPercent
          }
        })
        await model.updateDevice(userId, deviceId, {
          'states.openState': !!data && data.states.openState,
        });
      } else {
        // The device can only open in one direction
        await model.updateDevice(userId, deviceId, {
          'states.openPercent': execution.params.openPercent,
          'states.lastCommand': 'OpenClose',
        });
        states['openPercent'] = execution.params.openPercent
      }
      break;
    }
    
    // action.devices.traits.Reboot
    case 'action.devices.commands.Reboot': {
      // When the device reboots, we can make it go offline until the frontend turns it back on
      await model.updateDevice(userId, deviceId, {
        'states.online': false,
        'states.lastCommand': 'Reboot',
      });
      // Reboot trait is stateless
      break;
    }

    // action.devices.traits.Rotation
    case 'action.devices.commands.RotateAbsolute': {
      const {rotationPercent, rotationDegrees} = execution.params;
      if (rotationPercent) {
        await model.updateDevice(userId, deviceId, {
          'states.rotationPercent': rotationPercent,
          'states.lastCommand': 'RotateAbsolute',
        });
        states['rotationPercent'] = rotationPercent;
      } else if (rotationDegrees) {
        await model.updateDevice(userId, deviceId, {
          'states.rotationDegrees': rotationDegrees,
          'states.lastCommand': 'RotateAbsolute',
        });
        states['rotationDegrees'] = rotationDegrees;
      }
      break;
    }

    // action.devices.traits.RunCycle - No execution
    // action.devices.traits.Scene
    case 'action.devices.commands.ActivateScene': {
      await model.updateDevice(userId, deviceId, {
        'states.deactivate': execution.params.deactivate,
        'states.lastCommand': 'ActivateScene',
      });
      // Scenes are stateless
      break;
    }

    // action.devices.traits.SoftwareUpdate
    case 'action.devices.commands.SoftwareUpdate': {
      // When the device reboots, we can make it go offline until the frontend turns it back on
      await model.updateDevice(userId, deviceId, {
        'states.lastSoftwareUpdateUnixTimestampSec': Math.floor(
          new Date().getTime() / 1000
        ),
        'states.online': false,
        'states.lastCommand': 'SoftwareUpdate',
      });
      // SoftwareUpdate trait is stateless
      break;
    }

    // action.devices.traits.StartStop
    case 'action.devices.commands.StartStop': {
      await model.updateDevice(userId, deviceId, {
        'states.isRunning': execution.params.start,
        'states.lastCommand': 'StartStop',
      });
      states['isRunning'] = execution.params.start
      states['isPaused'] = !!data && data.states.isPaused
      break;
    }

    case 'action.devices.commands.PauseUnpause': {
      await model.updateDevice(userId, deviceId, {
        'states.isPaused': execution.params.pause,
        'states.lastCommand': 'PauseUnpause',
      });
      states['isPaused'] = execution.params.pause
      states['isRunning'] = !!data && data.states.isRunning
      break;
    }

    // action.devices.traits.TemperatureControl
    case 'action.devices.commands.SetTemperature': {
      await model.updateDevice(userId, deviceId, {
        'states.temperatureSetpointCelsius': execution.params.temperature,
        'states.lastCommand': 'SetTemperature',
      });
      states['temperatureSetpointCelsius'] = execution.params.temperature
      states['temperatureAmbientCelsius'] = !!data && data.states.temperatureAmbientCelsius
      break;
    }

    // action.devices.traits.TemperatureSetting
    case 'action.devices.commands.ThermostatTemperatureSetpoint': {
      await model.updateDevice(userId, deviceId, {
        'states.thermostatTemperatureSetpoint': execution.params.thermostatTemperatureSetpoint,
        'states.lastCommand': 'ThermostatTemperatureSetpoint',
      });
      states['thermostatTemperatureSetpoint'] = execution.params.thermostatTemperatureSetpoint
      states['thermostatMode'] = !!data && data.states.thermostatMode
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break;
    }

    case 'action.devices.commands.ThermostatTemperatureSetRange': {
      const {
        thermostatTemperatureSetpointLow,
        thermostatTemperatureSetpointHigh,
      } = execution.params
      await model.updateDevice(userId, deviceId, {
        'states.thermostatTemperatureSetpointLow': thermostatTemperatureSetpointLow,
        'states.thermostatTemperatureSetpointHigh': thermostatTemperatureSetpointHigh,
        'states.lastCommand': 'ThermostatTemperatureSetRange',
      });
      states['thermostatTemperatureSetpoint'] = !!data && data.states.thermostatTemperatureSetpoint
      states['thermostatMode'] = !!data && data.states.thermostatMode
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break;
    }

    case 'action.devices.commands.ThermostatSetMode': {
      await model.updateDevice(userId, deviceId, {
        'states.thermostatMode': execution.params.thermostatMode,
        'states.lastCommand': 'ThermostatSetMode',
      });
      states['thermostatMode'] = execution.params.thermostatMode
      states['thermostatTemperatureSetpoint'] = !!data && data.states.thermostatTemperatureSetpoint
      states['thermostatTemperatureAmbient'] = !!data && data.states.thermostatTemperatureAmbient
      states['thermostatHumidityAmbient'] = !!data && data.states.thermostatHumidityAmbient
      break;
    }

    // action.devices.traits.Timer
    case 'action.devices.commands.TimerStart': {
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': execution.params.timerTimeSec,
        'states.lastCommand': 'TimerStart',
      })
      states['timerRemainingSec'] = execution.params.timerTimeSec
      break;
    }

    case 'action.devices.commands.TimerAdjust': {
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      const newTimerRemainingSec = !!data && data.states.timerRemainingSec + execution.params.timerTimeSec
      if (newTimerRemainingSec < 0) {
        throw new Error('valueOutOfRange')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': newTimerRemainingSec,
        'states.lastCommand': 'TimerAdjust',
      })
      states['timerRemainingSec'] = newTimerRemainingSec
      break;
    }

    case 'action.devices.commands.TimerPause': {
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerPaused': true,
        'states.lastCommand': 'TimerPause',
      })
      states['timerPaused'] = true
      break;
    }

    case 'action.devices.commands.TimerResume': {
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerPaused': false,
        'states.lastCommand': 'TimerResume',
      })
      states['timerPaused'] = false
      break;
    }

    case 'action.devices.commands.TimerCancel': {
      if (!!data && data.states.timerRemainingSec === -1) {
        // No timer exists
        throw new Error('noTimerExists')
      }
      await model.updateDevice(userId, deviceId, {
        'states.timerRemainingSec': -1,
        'states.lastCommand': 'TimerCancel',
      })
      states['timerRemainingSec'] = 0
      break;
    }

    // action.devices.traits.Toggles
    case 'action.devices.commands.SetToggles': {
      const currentToggleSettings = !!data && data.states.currentToggleSettings;

      for (const toggle of Object.keys(execution.params.updateToggleSettings)) {
        const enable = execution.params.updateToggleSettings[toggle]
        currentToggleSettings[toggle] = enable
      }

      await model.updateDevice(userId, deviceId, {
        'states.currentToggleSettings': currentToggleSettings,
        'states.lastCommand': 'SetToggles',
      })
      states['currentToggleSettings'] = currentToggleSettings
      break;
    }
    
    // action.devices.traits.TransportControl
    case 'action.devices.commands.mediaPause': {
      await model.updateDevice(userId, deviceId, {
        'states.playbackState': 'PAUSED',
        'states.lastCommand': 'mediaPause',
      });
      states['playbackState'] = 'PAUSED';
      break;
    }

    case 'action.devices.commands.mediaResume': {
      await model.updateDevice(userId, deviceId, {
        'states.playbackState': 'PLAYING',
        'states.lastCommand': 'mediaResume',
      });
      states['playbackState'] = 'PLAYING';
      break;
    }

    case 'action.devices.commands.mediaStop': {
      await model.updateDevice(userId, deviceId, {
        'states.playbackState': 'STOPPED',
        'states.lastCommand': 'mediaStop',
      });
      states['playbackState'] = 'STOPPED';
      break;
    }

    case 'action.devices.commands.mediaPrevious': {
      await model.updateDevice(userId, deviceId, {
        'states.playbackState': 'PREVIOUS',
        'states.lastCommand': 'mediaPrevious',
      });
      states['playbackState'] = 'PREVIOUS';
      break;
    }

    case 'action.devices.commands.mediaNext': {
      await model.updateDevice(userId, deviceId, {
        'states.playbackState': 'NEXT',
        'states.lastCommand': 'mediaNext',
      });
      states['playbackState'] = 'NEXT';
      break;
    }

    // Traits are considered no-ops as they have no state
    case 'action.devices.commands.mediaSeekRelative': {
      break;
    }

    case 'action.devices.commands.mediaSeekToPosition': {
      break;
    }

    // action.devices.traits.Volume
    case 'action.devices.commands.setVolume': {
      await model.updateDevice(userId, deviceId, {
        'states.currentVolume': execution.params.volumeLevel,
        'states.lastCommand': 'setVolume',
      });

      states['currentVolume'] = execution.params.volumeLevel;
      break;
    }

    case 'action.devices.commands.volumeRelative': {
      const { relativeSteps } = execution.params;
      const currentVolume = !!data && data.states.currentVolume; 

      const newVolume = currentVolume + relativeSteps;

      await model.updateDevice(userId, deviceId, {
        'states.currentVolume': newVolume,
        'states.previousVolume': currentVolume,
        'states.lastCommand': 'volumeRelative',
      });

      states['currentVolume'] = newVolume;
      break;
    }
    
    case 'action.devices.commands.mute': {
      const { mute } = execution.params;

      await model.updateDevice(userId, deviceId, {
        'states.isMuted': mute,
        'states.lastCommand': 'mute',
      })
      
      states['isMuted'] = mute;
      break;
    }

    default:
      throw new Error('actionNotAvailable')
  }

  return states;
}

module.exports = dbExecute;