const model = require('../../database/model.js');

const getAll = async (req, res) => {
	console.log('Search hubs');
	if (res.locals.oauth.token) {
		await model.getHubs(res.locals.oauth.token.user.username)
		.exec()
		.then((hubs) => {
			res.json(hubs);
		})	
		.catch((err) => {
			console.log('error on searching hubs');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const getOne = async (req, res) => {
	console.log('Search hub', req.params);
	if (res.locals.oauth.token && req.params.id) {
		await model.getHub(res.locals.oauth.token.user.username, req.params.id)
		.exec()
		.then((device) => {
			res.json(device);
		})	
		.catch((err) => {
			console.log('error on searching hubs');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user or id device not specified');
		res.json({ errorCode: 1, text: 'user or id device not specified' });
	}
};

const create = async (req, res) => {
	console.log('Create hub');
	if (res.locals.oauth.token) {
		await model.createHub({
			...req.body,
			username: res.locals.oauth.token.user.username,
		})
		.then(res.json({ code: 0, text: "Hub´s created" }))
		.catch((err) => {
			console.log('error on searching hubs');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const update = async (req, res) => {
  console.log('Update hub');
	const {
		name,
		technologyType,
		controlType,
		host,
		apiKey,
		useQueue,
	} = req.body;

	if (res.locals.oauth.token && res.locals.oauth.token.user.username) {
    const updatePayload = {
		name,
		technologyType,
		useQueue,
		host,
		apiKey,
		controlType,
	};

	await model.updateHub(res.locals.oauth.token.user.username, req.params.id, updatePayload)
		.then(res.json({ code: 0, text: "Hub updated" }))
		.catch((err) => {
			console.log('error on update profile');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const remove = async (req, res) => {
	console.log('Delete hub');
	if (res.locals.oauth.token && req.params.id) {
		await model.removeHub(res.locals.oauth.token.user.username, req.params.id)
		.then(res.json({ code: 0, text: "Hub´s deleted" }))
		.catch((err) => {
			console.log('error on update hub');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user or id hub not specified');
		res.json({ errorCode: 1, text: 'user or id hub not specified' });
	}
};

module.exports = {
	getAll,
	getOne,
	create,
	update,
	remove,
};