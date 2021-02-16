const model = require('../../database/model.js');
const asyncForEach = require('../utilities/async-for-each.js');

const onQuery = async (body, headers, server) => {
	const userId = server.express.response.locals.oauth.token.user.username;
	const deviceStates = {};
	const { devices } = body.inputs[0].payload;

	await asyncForEach(devices, async (device) => {
		await model.getDevice(userId, device.id)
		.exec()
		.then((MyDeviceStates) => {
			deviceStates[device.id] = {
				status: "SUCCESS",
				...MyDeviceStates.states
			};
		})	
		.catch((err) => {
			console.log('error on searching devices');
		  return { errorCode: 1, text: 'error' };
		});
	});

	return {
		requestId: body.requestId,
		payload: {
			devices: deviceStates,
		},
	}
};

module.exports = onQuery;