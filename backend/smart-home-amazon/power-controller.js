const model = require('../../database/model.js');

const PowerController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const deviceOn = body.directive.header.name === 'TurnOn';
  let powerResult;
  let response;

  await model.updateDevice(userId, deviceId, {
    'states.on': deviceOn,
  });

  if (body.directive.header.name === "TurnOn") {
    powerResult = "ON";
  }
  else if (body.directive.header.name === "TurnOff") {
      powerResult = "OFF";
  }

  response = {
    context: {
      properties: [
        {
          namespace: "Alexa.PowerController",
          name: "powerState",
          value: powerResult,
          timeOfSample: new Date(),
          uncertaintyInMilliseconds: 0
        }
      ]
    },
    event: {
      header: {
        ...body.directive.header,
        messageId: body.directive.header.messageId + '-R',
        name: 'Response',
        namespace: 'Alexa',
      },
      endpoint: body.directive.endpoint,
      payload: body.directive.payload
    }
  };
    
  res.send(response);
}

module.exports = PowerController;