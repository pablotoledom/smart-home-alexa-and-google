const request = require('request');

const espurna = (device, hub, newData) => {

  const OnOff = device.states.on === true ? '1' : '0';
    const form = {
      OnOff,
      apikey: hub.apiKey,
    };

    console.log(`Dispatch ${hub.controlType} action: "${OnOff}", to ${hub.host}, channel: ${device.hubInformation.channel}`);

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
  });
}

module.exports = espurna;