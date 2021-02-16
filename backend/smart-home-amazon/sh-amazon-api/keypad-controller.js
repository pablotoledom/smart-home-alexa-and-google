const model = require('../../../database/model.js');
const deviceTranslator = require('../utilities/device-translator.js');

const KeypadController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;
  const payload = body.directive.payload;
  let device;

  if (headerProperties.name === 'SendKeystroke' && payload.keystroke) {
    device = await model.updateDevice(userId, deviceId, {
      'states.keyPressed': payload.keystroke,
      'states.lastCommand': 'keystroke',
    });
  }

  const response = {
    event: {
      header: {
        ...headerProperties,
        messageId: headerProperties.messageId + '-R',
        namespace: 'Alexa',
        name: 'Response',
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

module.exports = KeypadController;