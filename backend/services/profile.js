const model = require('../../database/model.js');

const get = async (req, res) => {
	console.log('Get profile');
	if (res.locals.oauth.token) {
		await model.getProfile(res.locals.oauth.token.user.username)
		.exec()
		.then((profile) => {
			res.json(profile);
		})	
		.catch((err) => {
			console.log('error on searching profile');
		  res.json({ errorCode: 1, text: 'error' });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

const update = async (req, res) => {
	const {
		name,
		lastName,
		userName,
		email,
		password,
	} = req.body;

	if (res.locals.oauth.token && req.params.username) {
		// Payload can contain any state data
    // tslint:disable-next-line
    
    const updatePayload = {
      name,
      lastName,
      userName,
      email,
		};

		if (password) {
			updatePayload.password = password;
		}

		await model.updateProfile(res.locals.oauth.token.user.username, updatePayload)
		.then(res.json({ code: 0, text: "Profile updated" }))
		.catch((err) => {
			console.log('error on update profile');
		  res.json({ code: 1, text: err.message });
		});
	} else {
		console.log('user not specified');
		res.json({ errorCode: 1, text: 'user not specified' });
	}
};

module.exports = {
	get,
	update,
};