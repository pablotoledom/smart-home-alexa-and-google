const model = require('../../../database/model.js');
const deviceTranslator = require('../utilities/device-translator.js');

const InputController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;
  const input = body.directive.payload.input;

  const device = await model.updateDevice(userId, deviceId, {
    'states.currentInput': input,
    'states.lastCommand': 'SetInput',
  });

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
      properties: deviceTranslator(device).properties,
    }
  };
    
  res.send(response);
}

module.exports = InputController;