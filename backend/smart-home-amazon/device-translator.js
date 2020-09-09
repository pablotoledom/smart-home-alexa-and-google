const deviceTranslator = (myDevice) => {
  // SET BASE OBJECT
  const deviceTranslated = {
    device: {
      endpointId: myDevice.id,
      manufacturerName: myDevice.manufacturer,
      friendlyName: myDevice.nicknames[0],
      description: myDevice.name,
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
      displayCategories: [],
    },
    properties: [
      {
        "namespace": "Alexa.PowerController",
        "name": "powerState",
        "value": myDevice.states.on ? 'ON' : 'OFF',
        "timeOfSample": new Date(),
        "uncertaintyInMilliseconds": 5000
      }
    ]
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

  // SET CAPABILITIES
  if (myDevice.traits.find(item=>item==='action.devices.traits.OnOff')) {
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

  return deviceTranslated;
};

module.exports = deviceTranslator;