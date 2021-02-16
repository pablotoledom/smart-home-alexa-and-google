const model = require('../../../database/model.js');

const SceneController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;

  const device = await model.updateDevice(userId, deviceId, {
    'states.deactivate': false,
    'states.lastCommand': 'ActivateScene',
  });

  const response = {
    event: {
      header: {
        ...headerProperties,
        namespace: 'Alexa.SceneController',
        name: 'ActivationStarted',
        messageId: headerProperties.messageId + '-R',
      },
      endpoint: body.directive.endpoint,
      payload: {
        cause : {
          type : "VOICE_INTERACTION"
        },
        timestamp : new Date(),
      }
    }
  };
    
  res.send(response);
}

module.exports = SceneController;