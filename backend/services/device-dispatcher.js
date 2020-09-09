const request = require('request');
const querystring = require('querystring');

const deviceDispatcher = async (device, getHub) => {
  // Set change to SonOff spurna hub
  if ((device.states.on || !device.states.on) && device.hubExecution) {
    // Get device hub
    const hub = await getHub(device.username, device.hubInformation.hubId);

    // ESPURNA dispatch
    if (hub.controlType === 'ESPURNA') {
      const value = device.states.on === true ? '1' : '0';
      const form = {
        value,
        apikey: hub.apiKey,
      };

      console.log(`Dispatch ${hub.controlType} action: "${value}", to ${hub.host}, channel: ${device.hubInformation.channel}`);

      const formData = querystring.stringify(form);
      const contentLength = formData.length;

      request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: `${hub.host}/api/${device.hubInformation.channel}`,
        body: formData,
        method: 'PUT'
      }, function (err, res, body) {
        //it works!
      });
    }
  }

  // return device;
}

module.exports = deviceDispatcher;