const model = require('../../database/model.js');
const deviceTranslator = require('./device-translator.js');

const reportState = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const deviceId = body.directive.endpoint.endpointId;
  let response;

  await model.getDevice(userId, deviceId)
		.exec()
		.then((myDevice) => {
      const device = deviceTranslator(myDevice);
      response = {
        event: {
          header: {
            ... body.directive.header,
            name: 'StateReport',
          },
          endpoint: body.directive.endpoint,
          payload: {
          }
        },
        context: {
          properties: device.properties
        },
      };
    })
    .catch((err) => {
			console.log('error on searching devices');
		});
    
  res.send(response);
}

module.exports = reportState;