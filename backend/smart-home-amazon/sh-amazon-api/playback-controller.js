const model = require('../../../database/model.js');
const deviceTranslator = require('../utilities/device-translator.js');

const PlaybackController = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;
  let device;

  if (headerProperties.name === "Stop") {
    device = await model.updateDevice(userId, deviceId, {
      'states.playbackState': 'STOPPED',
      'states.lastCommand': 'mediaStop',
    });
  }

  if (headerProperties.name === "Pause") {
    device = await model.updateDevice(userId, deviceId, {
      'states.playbackState': 'PAUSED',
      'states.lastCommand': 'mediaPause',
    });
  }  
  
  if (headerProperties.name === "Play") {
    device = await model.updateDevice(userId, deviceId, {
      'states.playbackState': 'PLAYING',
      'states.lastCommand': 'mediaResume',
    });
  }

  if (headerProperties.name === "Previous") {
    device = await model.updateDevice(userId, deviceId, {
      'states.playbackState': 'PREVIOUS',
      'states.lastCommand': 'mediaPrevious',
    });
  }

  if (headerProperties.name === "Next") {
    device = await model.updateDevice(userId, deviceId, {
      'states.playbackState': 'NEXT',
      'states.lastCommand': 'mediaNext',
    });
  }

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
    
  res.send(response);
}

module.exports = PlaybackController;