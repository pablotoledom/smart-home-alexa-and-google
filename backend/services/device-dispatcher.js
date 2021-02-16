const espurnaHub = require('./hubsTypes/espurna');
const tasmotaHub = require('./hubsTypes/tasmota');

const deviceDispatcher = async (device, newData, getHub) => {
  // Set change to hub
  if (device && device.states && (device.states.on || !device.states.on) && device.hubExecution) {
    // Get device hub
    const hub = await getHub(device.username, device.hubInformation.hubId);

    const functionExecution = () => {
      // ESPURNA dispatch
      if (hub.controlType === 'ESPURNA') {
        espurnaHub(device, hub, newData);
      }
  
      // TASMOTA dispatch
      if (hub.controlType === 'TASMOTA') {
        tasmotaHub(device, hub, newData);
      }
    }

    // Use Queue Execution
    if (hub.useQueue) {
        global.myQueue.push(functionExecution);
      // }
    } else {
      functionExecution();
    }
  }

  return device;
}

module.exports = deviceDispatcher;