// ********* IMPORTS *********
const { smarthome } = require('actions-on-google');
const model = require('../../database/model.js');
const onSync = require('./on-sync.js');
const onQuery = require('./on-query.js');
const onExecute = require('./on-execute.js');
const onDisconnect = require('./on-disconnect.js');


// ********* LOAD KEY FOR GOOGLE ACTIONS *********
let jwt;
try {
	jwt = require('./smart-home-key.json');
} catch (e) {
	console.warn('Service account key is not found');
	console.warn('Report state and Request sync will be unavailable');
}


// ********* DEFINE SMARTHOME OBJECT *********
global.mySmartHomeGoogle = smarthome({
	jwt,
	debug: true,
});


// ********* ONSYNC METHOD *********
mySmartHomeGoogle.onSync(onSync);
mySmartHomeGoogle.onQuery(onQuery);
mySmartHomeGoogle.onExecute(onExecute);
mySmartHomeGoogle.onDisconnect(onDisconnect);

module.exports = mySmartHomeGoogle;
