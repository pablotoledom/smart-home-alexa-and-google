const model = require('../../../database/model.js');

const fanSpeedTranslator = require('../utilities/fan-speed-translator');
const translateModes = require('../utilities/mode-translator');

const ThermostatController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;
  const response = {
    event: {
      header: {
        ...headerProperties,
        messageId: headerProperties.messageId + '-R',
        name: 'Response',
        namespace: 'Alexa',
      },
      endpoint: body.directive.endpoint,
      payload: body.directive.payload
    },
    context: {
      properties: []
    }
  };
  let data;
  let device;

  if (headerProperties.name === "SetTargetTemperature") {
    data = body.directive.payload.targetSetpoint.value;
    device = await model.updateDevice(userId, deviceId, {
      'states.thermostatTemperatureSetpoint': data,
      'states.lastCommand': 'ThermostatTemperatureSetpoint',
    });
  }
  if (headerProperties.name === "AdjustTargetTemperature") {
    data = body.directive.payload.targetSetpointDelta.value;
    const deviceInDB = await model.getDevice(userId, deviceId);
    const currentTemperature = deviceInDB.states.thermostatTemperatureSetpoint

    device = await model.updateDevice(userId, deviceId, {
      'states.thermostatTemperatureSetpoint': Number(currentTemperature + data),
      'states.lastCommand': 'ThermostatTemperatureSetpoint',
    });
  }
  else if (headerProperties.name === "SetThermostatMode") {
    data = body.directive.payload.thermostatMode.value;
    device = await model.updateDevice(userId, deviceId, {
      'states.thermostatMode': data.toLowerCase(),
      'states.lastCommand': 'ThermostatSetMode',
    });
  }
  else if (headerProperties.name === "fanOperation") {
    data = body.directive.payload.fanOperation.value;
    device = await model.updateDevice(userId, deviceId, {
      'states.currentFanSpeedSetting': fanSpeedTranslator(data, true),
      'states.lastCommand': 'SetFanSpeed',
    });
  }

  device.traits.map((trait) => {
    if (trait === 'action.devices.traits.Modes') {
      response.context.properties.push({
        namespace: "Alexa.ThermostatController",
        name: "thermostatMode",
        value: translateModes(device.states.thermostatMode),
        timeOfSample: new Date(),
        uncertaintyInMilliseconds: 500
      });
    }

    if (trait === 'action.devices.traits.TemperatureSetting') {
      response.context.properties.push({
        namespace: "Alexa.ThermostatController",
        name: "targetSetpoint",
        value: {
          value: device.states.thermostatTemperatureSetpoint,
          scale: "CELSIUS"
        },
        timeOfSample: new Date(),
        uncertaintyInMilliseconds: 500
      });
    }

    if (trait === 'action.devices.traits.FanSpeed') {
      response.context.properties.push({
        namespace: "Alexa.ThermostatController.HVAC.Components",
        name: "fanOperation",
        value: fanSpeedTranslator(device.states.currentFanSpeedSetting),
        timeOfSample: new Date(),
        uncertaintyInMilliseconds: 500
      });
    }

    if (trait === 'action.devices.traits.OnOff') {
      response.context.properties.push({
        namespace: "Alexa.PowerController",
        name: "powerState",
        value: device.states.on ? 'ON' : 'FALSE',
        timeOfSample: new Date(),
        uncertaintyInMilliseconds: 500
      });
    }
  });
    
  res.send(response);
}

module.exports = ThermostatController;