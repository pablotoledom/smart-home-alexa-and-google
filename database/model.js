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

var clientModel = require('./model/client'),
	tokenModel = require('./model/token'),
	userModel = require('./model/user'),
	deviceModel = require('./model/device'),
	hubModel = require('./model/hub'),
	deviceDispatcher = require('../backend/services/device-dispatcher');


/** Methods used by all grant types. **/

var getAccessToken = function (token, callback) {
	tokenModel.findOne({
		accessToken: token
	}).lean().exec((function (callback, err, token) {

		if (!token) {
			console.error('Token not found');
		}

		callback(err, token);
	}).bind(null, callback));
};

var getClient = function (clientId, clientSecret, callback) {
	clientModel.findOne({
		clientId: clientId,
		clientSecret: clientSecret
	}).lean().exec((function (callback, err, client) {

		if (!client) {
			console.error('Client not found');
		}

		callback(err, client);
	}).bind(null, callback));
};

var saveToken = function (token, client, user, callback) {
	token.client = {
		id: client.clientId
	};

	token.user = {
		username: user.username
	};

	var tokenInstance = new tokenModel(token);
	tokenInstance.save((function (callback, err, token) {

		if (!token) {
			console.error('Token not saved');
		} else {
			token = token.toObject();
			delete token._id;
			delete token.__v;
		}

		callback(err, token);
	}).bind(null, callback));
};


/** Method used only by password grant type. **/

var getUser = function (username, password, callback) {
	userModel.findOne({
		username: username,
		password: password
	}).lean().exec((function (callback, err, user) {

		if (!user) {
			console.error('User not found');
		}

		callback(err, user);
	}).bind(null, callback));
};

/** Method used only by client_credentials grant type. **/

var getUserFromClient = function (client, callback) {

	clientModel.findOne({
		clientId: client.clientId,
		clientSecret: client.clientSecret,
		grants: 'client_credentials'
	}).lean().exec((function (callback, err, client) {

		if (!client) {
			console.error('Client not found');
		}

		callback(err, {
			username: ''
		});
	}).bind(null, callback));
};

/** Methods used only by refresh_token grant type. **/

var getRefreshToken = function (refreshToken, callback) {

	tokenModel.findOne({
		refreshToken: refreshToken
	}).lean().exec((function (callback, err, token) {

		if (!token) {
			console.error('Token not found');
		}

		callback(err, token);
	}).bind(null, callback));
};

var revokeToken = function (token, callback) {

	tokenModel.deleteOne({
		refreshToken: token.refreshToken
	}).exec((function (callback, err, results) {

		var deleteSuccess = results && results.deletedCount === 1;

		if (!deleteSuccess) {
			console.error('Token not deleted');
		}

		callback(err, deleteSuccess);
	}).bind(null, callback));
};


/** Method used for get devices. **/
var getDevices = (username) => deviceModel
	.find({
		username,
	});


/** Method used for get one device. **/
var getDevice = (username, id) => deviceModel
	.findOne({
		id,
		username,
	});


/** Method used for get one device in real time. **/
var getDeviceInRealTime = (username, id) => deviceModel.watch();


/** Method used for create device **/
var createDevice = (dataDevice) => deviceModel
	.create(dataDevice);


/** Method used for update device **/
var updateDevice = (username, id, newData) => {
	return deviceModel
		.findOneAndUpdate({
				id,
				username,
			},
			newData, {
				multi: true,
				new: true,
			}).then((document) => {
				deviceDispatcher(document, newData, getHub);
				return document;
			})
			.catch(document => document);
}


/** Method used for remove device **/
var removeDevice = (username, id) => deviceModel
	.findOneAndDelete({
		id,
		username,
	});


/** Method used for get profile. **/
var getProfile = (username) => userModel
	.findOne({
		username,
	});


/** Method used for update profile **/
var updateProfile = (username, newData) => {
	return userModel
		.findOneAndUpdate({
				username,
			},
			newData, {
				multi: false,
				new: false,
			})
			.then(document => document)
			.catch(document => document);
}


/** Method used for get hubs. **/
var getHubs = (username) => hubModel
	.find({
		username,
	});


/** Method used for get one hub. **/
var getHub = (username, id) => hubModel
	.findOne({
		id,
		username,
	});


/** Method used for create device **/
var createHub = (dataDevice) => hubModel
	.create(dataDevice);


/** Method used for update device **/
var updateHub = (username, id, newData) => {
	return hubModel
		.findOneAndUpdate({
				id,
				username,
			},
			newData, {
				multi: true,
				new: true,
			})
			.then(document => document)
			.catch(document => document);
}


/** Method used for remove device **/
var removeHub = (username, id) => hubModel
	.findOneAndDelete({
		id,
		username,
	});


/** Export model definition object. **/
module.exports = {
	getAccessToken,
	getClient,
	saveToken,
	getUser,
	getUserFromClient,
	getRefreshToken,
	revokeToken,
	getDevices,
	getDevice,
	getDeviceInRealTime,
	createDevice,
	updateDevice,
	removeDevice,
	getProfile,
	updateProfile,
	getHubs,
	getHub,
	createHub,
	updateHub,
	removeHub
};