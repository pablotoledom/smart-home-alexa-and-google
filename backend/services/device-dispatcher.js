const request = require('request');
const querystring = require('querystring');

const deviceDispatcher = async (device, getHub) => {
  // Set change to hub
  if (device && device.states && (device.states.on || !device.states.on) && device.hubExecution) {
    // Get device hub
    const hub = await getHub(device.username, device.hubInformation.hubId);

    // ESPURNA dispatch
    if (hub.controlType === 'ESPURNA') {
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

    // TASMOTA dispatch
    if (hub.controlType === 'TASMOTA') {
      const OnOff = device.states.on === true ? '1' : '0';
      const form = {
        OnOff,
        apikey: hub.apiKey,
      };

      console.log(`Dispatch ${hub.controlType} action: "${OnOff === '1' ? 'dataON' : 'dataOFF' } ${OnOff === '1' ? device.hubInformation.dataON : device.hubInformation.dataOFF};", to ${hub.host}`);

      const formData = querystring.stringify(form);
      const contentLength = formData.length;

      request({
        headers: {
          'Content-Length': contentLength,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        uri: `${hub.host}/cm?cmnd=Backlog RfRaw ${OnOff === '1' ? device.hubInformation.dataON : device.hubInformation.dataOFF}; RfRaw 0;`,
        body: formData,
        method: 'PUT'
      }, function (err, res, body) {
        //it works!
      });
    }
  }

  return device;
}

module.exports = deviceDispatcher;