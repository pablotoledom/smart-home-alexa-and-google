const model = require('../../database/model.js');

const getAll = async (req, res) => {
	console.log('Search devices');
	if (res.locals.oauth.token) {
		await model.getDevices(res.locals.oauth.token.user.username)
		.exec()
		.then((devices) => {
			res.json(devices);
		})	
		.catch((err) => {
			console.log('error on searching devices');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const getOne = async (req, res) => {
	console.log('Find device', req.params);
	if (res.locals.oauth.token && req.params.id) {
		await model.getDevice(res.locals.oauth.token.user.username, req.params.id)
		.exec()
		.then((device) => {
			res.json(device);
		})	
		.catch((err) => {
			console.log('error on searching devices');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user or id device not specified');
		res.json({ errorCode: 1, text: 'user or id device not specified' });
	}
};

const getOneInRealtime = async (req, res) => {
	console.log('Realtime devices', req.params);
	if (res.locals.oauth.token && req.params.id) {
		await model.getDevice(res.locals.oauth.token.user.username, req.params.id)
		.exec()
		.then((device) => {
			res.json(device);
		})	
		.catch((err) => {
			console.log('error on searching devices');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user or id device not specified');
		res.json({ errorCode: 1, text: 'user or id device not specified' });
	}
};

const create = async (req, res) => {
	console.log('Create device');
	if (res.locals.oauth.token) {
		await model.createDevice({
			...req.body,
			username: res.locals.oauth.token.user.username,
		})
		.then(res.json({ code: 0, text: "Device´s created" }))
		.catch((err) => {
			console.log('error on searching devices');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const update = async (req, res) => {
	const {
		name,
		nickname,
		states,
		localDeviceId,
		errorCode, 
		tfa,
		hubExecution,
		hubInformation,
	} = req.body;

	// console.log('Update device: ', req.body);
	if (res.locals.oauth.token && req.params.id) {
		// Payload can contain any state data
		// tslint:disable-next-line
		const updatePayload = {};

		if (name) {
			updatePayload['name'] = name
		}
		if (nickname) {
			updatePayload['nicknames'] = [nickname]
		}
		if (states) {
			updatePayload['states'] = states
		}
		if (localDeviceId === null) { // null means local execution has been disabled.
			// updatePayload['otherDeviceIds'] = admin.firestore.FieldValue.delete()
		} else if (localDeviceId !== undefined) { // undefined means localDeviceId was not updated.
			updatePayload['otherDeviceIds'] = [{deviceId: localDeviceId}]
		}
		if (hubExecution) {
			updatePayload['hubExecution'] = hubExecution;
			updatePayload['hubInformation'] = hubInformation;
		} else if (hubExecution === false) {
			updatePayload['hubExecution'] = hubExecution;
		}
		if (errorCode) {
			updatePayload['errorCode'] = errorCode
		} else if (!errorCode) {
			updatePayload['errorCode'] = ''
		}
		if (tfa) {
			updatePayload['tfa'] = tfa
		} else if (tfa !== undefined) {
			updatePayload['tfa'] = ''
		}

		await model.updateDevice(res.locals.oauth.token.user.username, req.params.id, updatePayload)
		.then(res.json({ code: 0, text: "Device´s updated" }))
		.catch((err) => {
			console.log('error on update device');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user or id device not specified');
		res.json({ errorCode: 1, text: 'user or id device not specified' });
	}
};

const remove = async (req, res) => {
	console.log('Delete device');
	if (res.locals.oauth.token && req.params.id) {
		await model.removeDevice(res.locals.oauth.token.user.username, req.params.id)
		.then(res.json({ code: 0, text: "Device´s deleted" }))
		.catch((err) => {
			console.log('error on update device');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user or id device not specified');
		res.json({ errorCode: 1, text: 'user or id device not specified' });
	}
};

module.exports = {
	getAll,
	getOne,
	create,
	update,
	remove,
	getOneInRealtime,
};