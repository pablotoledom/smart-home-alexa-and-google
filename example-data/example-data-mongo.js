
/**
 * Configuration.
 */

var mongoose = require('mongoose');
const mongoUri = require('../connections/database-setup');

mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true
}, function (err, res) {

	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
});

var clientModel = require('../database/model/client'),
	tokenModel = require('../database/model/token'),
	userModel = require('../database/model/user'),
	hubModel = require('../database/model/hub'),
	deviceModel = require('../database/model/device');

/**
 * Add example client and user to the database (for debug).
 */

var loadExampleData = function() {

	var client1 = new clientModel({
		id: 'mySuperId',	// TODO: Needed by refresh_token grant, because there is a bug at line 103 in https://github.com/oauthjs/node-oauth2-server/blob/v3.0.1/lib/grant-types/refresh-token-grant-type.js (used client.id instead of client.clientId)
		clientId: 'mySuperId',
		clientSecret: 'mySuperSecretKey',
		grants: [
			'password',
			'refresh_token'
		],
		redirectUris: []
	});

	client1.save(function(err, client) {
		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	var client2 = new clientModel({
		clientId: 'confidentialApplication',
		clientSecret: 'topSecret',
		grants: [
			'password',
			'client_credentials'
		],
		redirectUris: []
	});

	client2.save(function(err, client) {
		if (err) {
			return console.error(err);
		}
		console.log('Created client', client);
	});

	var user = new userModel({
		email: 'updateYour@email.com',
		name: 'My Name',
		lastName: 'My Last Name',
		username: 'myUserName',
		password: 'smarthome'
	});

	user.save(function(err, user) {
		if (err) {
			return console.error(err);
		}
		console.log('Created user', user);
	});

	var hub = new hubModel({
    "id" : "1ze0",
    "name" : "SONOFF RF-Bridge",
    "technologyType" : "RF433",
    "controlType" : "ESPURNA",
    "host" : "http://192.168.1.11",
    "username" : "myUserName",
    "apiKey" : "yourApiEspurnaKey",
	});

	hub.save(function(err, hub) {
		if (err) {
			return console.error(err);
		}
		console.log('Created hub', hub);
	});

	var device = new deviceModel({
    "username" : "myUserName",
    "attributes" : {
        "colorModel" : "rgb"
    },
    "defaultNames" : [ 
        "Simple Lamp"
    ],
    "deviceId" : "11dm",
    "errorCode" : "",
    "hwVersion" : "1.0.0",
    "id" : "11dm",
    "localDeviceExecution" : false,
    "manufacturer" : "L",
    "model" : "L",
    "name" : "Lampara comedor",
    "nicknames" : [ 
        "Luz comedor"
    ],
    "roomHint" : "Terrace",
    "states" : {
        "color" : {
            "temperatureK" : 2000
        },
        "on" : true,
        "online" : true
    },
    "swVersion" : "2.0.0",
    "traits" : [ 
        "action.devices.traits.OnOff"
    ],
    "type" : "action.devices.types.LIGHT",
    "willReportState" : true,
    "hubExecution" : true,
    "hubInformation" : {
        "hubId" : "1ze0",
        "channel" : "relay/0"
    }
	});

	device.save(function(err, device) {

		if (err) {
			return console.error(err);
		}
		console.log('Created device', device);
	});
};

// Ejecute Script
loadExampleData();

/**
 * Dump the database content (for debug).
 */

var dump = function() {
	clientModel.find(function(err, clients) {
		if (err) {
			return console.error(err);
		}
		console.log('clients', clients);
	});

	tokenModel.find(function(err, tokens) {
		if (err) {
			return console.error(err);
		}
		console.log('tokens', tokens);
	});

	userModel.find(function(err, users) {
		if (err) {
			return console.error(err);
		}
		console.log('users', users);
	});

	hubModel.find(function(err, hubs) {
		if (err) {
			return console.error(err);
		}
		console.log('hubs', hubs);
	});

	deviceModel.find(function(err, devices) {
		if (err) {
			return console.error(err);
		}
		console.log('devices', devices);
	});
};