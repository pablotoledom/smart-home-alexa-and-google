const fanSpeedTranslator = require('./fan-speed-translator');
const playbackTranslator = require('./playback-translator');

const deviceTranslator = (myDevice) => {
  // SET BASE OBJECT
  const deviceTranslated = {
    device: {
      endpointId: myDevice.id,
      manufacturerName: myDevice.manufacturer,
      friendlyName: myDevice.nicknames[0],
      description: myDevice.name,
      displayCategories: [],
      capabilities: [{
        "type": "AlexaInterface",
        "interface": "Alexa",
        "version": "3"
      },
      {
        "type":"AlexaInterface",
        "interface":"Alexa.EndpointHealth",
        "version":"3",
        "properties":{
           "supported":[
              {
                 "name":"connectivity"
              }
           ],
           "proactivelyReported":true,
           "retrievable":true
        }
      }],
    },
    properties: [{
      "namespace": "Alexa.EndpointHealth",
      "name": "connectivity",
      "value": {
        "value": "OK"
      },
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 0
    }]
  }

  // SET CATEGORIES
  if (myDevice.type === 'action.devices.types.LIGHT') {
    deviceTranslated.device.displayCategories.push('LIGHT');
  }

  if (myDevice.type === 'action.devices.types.SWITCH') {
    deviceTranslated.device.displayCategories.push('SWITCH');
  }

  if (myDevice.type === 'action.devices.types.LOCK') {
    deviceTranslated.device.displayCategories.push('SMARTLOCK');
  }

  if (myDevice.type === 'action.devices.types.AC_UNIT') {
    deviceTranslated.device.displayCategories.push('THERMOSTAT', 'TEMPERATURE_SENSOR');
  }

  if (myDevice.type === 'action.devices.types.SPEAKER') {
    deviceTranslated.device.displayCategories.push('SPEAKER');
  }
  
  if (myDevice.type === 'action.devices.types.TV') {
    deviceTranslated.device.displayCategories.push('TV');
  }

  if (myDevice.type === 'action.devices.types.SCENE') {
    deviceTranslated.device.displayCategories.push('SCENE_TRIGGER');
  }

  // SET CAPABILITIES
  if (myDevice.traits.find(item=>item==='action.devices.traits.OnOff')) {
    deviceTranslated.properties.push({
      "namespace": "Alexa.PowerController",
      "name": "powerState",
      "value": myDevice.states.on ? 'ON' : 'OFF',
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 5000
    });

    deviceTranslated.device.capabilities.push({
      "interface": "Alexa.PowerController",
      "version": "3",
      "type": "AlexaInterface",
      "properties": {
        "supported": [
          {
            "name": "powerState"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.Brightness')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.BrightnessController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "brightness"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    });
  }

  if(myDevice.traits.find(item=>item==='action.devices.traits.Brightness')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.PercentageController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "percentage"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.ColorSetting')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.ColorTemperatureController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "colorTemperatureInKelvin"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    });
  }
    
  if (myDevice.traits.find(item=>item==='action.devices.traits.ColorSetting')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.PowerLevelController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "powerLevel"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      }
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.LockUnlock')) {
    deviceTranslated.device.capabilities.push({
      "type":"AlexaInterface",
      "interface":"Alexa.LockController",
      "version":"3",
      "properties":{
         "supported":[
            {
               "name":"lockState"
            }
         ],
         "proactivelyReported":true,
         "retrievable":true
      }
   });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.TemperatureSetting')) {
    const translateModes = (mode) => {
      switch (mode) {
        case 'auto':
          return "AUTO";
        case 'cool':
            return "COOL";
        case 'heat':
          return "HEAT";
        case 'fan-only':
          return 'ECO';      
        default:
          return 'OFF';
      }
    };

    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.ThermostatController",
      "version": "3",
      "properties": {
        "supported": [
          {
            "name": "targetSetpoint"
          },
          {
            "name": "thermostatMode"
          }
        ],
        "proactivelyReported": true,
        "retrievable": true
      },
      "configuration": {
        "supportedModes": myDevice.attributes.availableThermostatModes.map(v => translateModes(v)),
        "supportsScheduling": false
      }
    });

    deviceTranslated.properties.push({
      "namespace": "Alexa.ThermostatController",
      "name": "thermostatMode",
      "value": myDevice.states.thermostatMode.toUpperCase(),
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 500
    },
    {
      "namespace": "Alexa.ThermostatController",
      "name": "targetSetpoint",
      "value": {
        "value": myDevice.states.thermostatTemperatureSetpoint,
        "scale": myDevice.attributes.temperatureTemperatureUnit === 'C'? 'CELSIUS' : 'FAHRENHEIT'
      },
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 500
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.FanSpeed')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.ThermostatController.HVAC.Components",
      "version": "1.0",
      "properties": {
        "supported": [
          {
            "name": "fanOperation"
          },
        ],
        "retrievable": true,
        "proactivelyReported": true
      },
      "configuration": {
        "numberOfFanOperations": 3
      }
    });

    deviceTranslated.properties.push({
      "namespace": "Alexa.ThermostatController.HVAC.Components",
      "name": "fanOperation",
      "value": fanSpeedTranslator(myDevice.states.currentFanSpeedSetting),
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 0
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.Volume')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.Speaker",
      "version": "3",
      "properties": {
        "supported": [{
          "name": "volume"
        },{
          "name": "muted"
        }],
        "retrievable": true,
        "proactivelyReported": true
      }
    });

    deviceTranslated.properties.push({
      "namespace": "Alexa.Speaker",
      "name": "volume",
      "value": myDevice.states.currentVolume,
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 0
    },{
      "namespace": "Alexa.Speaker",
      "name": "muted",
      "value": myDevice.states.isMuted,
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 0
    });
  }

  if (myDevice.traits.find(item=>item==='action.devices.traits.InputSelector')) {
    // deviceTranslated.device.capabilities.push({
    //   "type": "AlexaInterface",
    //   "interface": "Alexa.InputController",
    //   "version": "3",
    //   "properties": {
    //     "supported": [{
    //       "name": "input"
    //     }],
    //     "proactivelyReported": true,
    //     "retrievable": true
    //   },
    //   "inputs": myDevice.attributes.availableInputs.map(input => ({
    //     name: input.key,
    //   })),
    const mergeNames = (names) => {
      const namesMerged = [
        ...names[0].name_synonym,
        ...names[1].name_synonym,
      ];
      
      return [... new Set(namesMerged)];
    };

    deviceTranslated.device.capabilities.push({
      "interface": "Alexa.InputController",
      "type": "AlexaInterface",
      "version": "3",
      "configurations": {
        "inputs": myDevice.attributes.availableInputs.map(input => ({
          "name": input.key,
          "friendlyNames": mergeNames(input.names),
        }))
      }
    });

    deviceTranslated.properties.push({
      "namespace": "Alexa.InputController",
      "name": "input",
      "value": myDevice.states.currentInput,
      "timeOfSample": new Date(),
      "uncertaintyInMilliseconds": 0
    });
  }
  
  if (myDevice.traits.find(item=>item==='action.devices.traits.TransportControl')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.PlaybackController",
      "version": "3",
      "supportedOperations" : myDevice.attributes.transportControlSupportedCommands.map(operation => playbackTranslator(operation))
    }, {
      "type": "AlexaInterface",
      "interface": "Alexa.KeypadController",
      "version": "3",
      "keys": [
        "INFO", "SELECT",
        "UP", "DOWN", "LEFT", "RIGHT",
      ]
    });
  }
  
  if (myDevice.traits.find(item=>item==='action.devices.traits.Scene')) {
    deviceTranslated.device.capabilities.push({
      "type": "AlexaInterface",
      "interface": "Alexa.SceneController",
      "version": "3",
      "supportsDeactivation": false
    });
  }

  return deviceTranslated;
};

module.exports = deviceTranslator;