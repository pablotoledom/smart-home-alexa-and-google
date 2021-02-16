const model = require('../../database/model.js');
const deviceTranslator = require('./utilities/device-translator.js');

const dicovery = async (req, res) => {
  const body = req.body;
  const userId = res.locals.oauth.token.user.username;
  const devices = [];
  let response;

  await model.getDevices(userId)
		.exec()
		.then((myDevices) => {
      myDevices.forEach(device => {
        const deviceTranslated = deviceTranslator(device);
        
        if(deviceTranslated.device && deviceTranslated.device.displayCategories.length > 0) {
          devices.push(deviceTranslated.device);
          response = {
            "event": {
              header: {
                ... body.directive.header,
                name: 'Discover.Response',
              },
              "payload": {
                "endpoints": devices
              }
            }
          };
        }
			});
    })
    .catch((err) => {
			console.log('error on searching devices');
		});
    
  res.send(response);
}

module.exports = dicovery;