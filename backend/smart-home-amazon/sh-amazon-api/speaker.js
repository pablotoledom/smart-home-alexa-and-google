const model = require('../../../database/model.js');
const deviceTranslator = require('../utilities/device-translator.js');

const speaker = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  const headerProperties = body.directive.header;
  let device;

  if (headerProperties.name === "SetMute") {
    const mute = body.directive.payload.mute;
    device = await model.updateDevice(userId, deviceId, {
      'states.isMuted': mute,
      'states.lastCommand': 'mute',
    });
  }  
  
  if (headerProperties.name === "AdjustVolume") {
    const volume = body.directive.payload.volume;
    const deviceInDB = await model.getDevice(userId, deviceId);
    const currentVolume = deviceInDB.states.currentVolume;
    let volumeAdjust = 0;

    if (body.directive.payload.volumeDefault) {
      if (volume > 0) {
        volumeAdjust = 2;
      } else if (volume < 0) {
        volumeAdjust = -2;
      }
    } else {
      volumeAdjust = volume;
    }

    device = await model.updateDevice(userId, deviceId, {
      'states.currentVolume': Number(currentVolume + volumeAdjust),
      'states.previousVolume': currentVolume,
      'states.lastCommand': 'volumeRelative',
    });
  }

  if (headerProperties.name === "SetVolume") {
    const volume = body.directive.payload.volume;
    const deviceInDB = await model.getDevice(userId, deviceId);
    const currentVolume = deviceInDB.states.currentVolume

    device = await model.updateDevice(userId, deviceId, {
      'states.currentVolume': volume,
      'states.previousVolume': currentVolume,
      'states.lastCommand': 'setVolume',
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
      properties: deviceTranslator(device).properties,
    }
  };
    
  res.send(response);
}

module.exports = speaker;