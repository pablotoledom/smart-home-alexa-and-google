const model = require('../../database/model.js');

const onSync = async (body, headers, server) => {
	const userId = server.express.response.locals.oauth.token.user.username;
	let formatDevices;
	await model.getDevices(userId)
		.exec()
		.then((myDevices) => {
			const devices = [];
			myDevices.forEach(data => {
				const device = {
					id: data.id,
					type: data.type,
					traits: data.traits,
					name: {
						defaultNames: data.defaultNames,
						name: data.name,
						nicknames: data.nicknames,
					},
					deviceInfo: {
						manufacturer: data.manufacturer,
						model: data.model,
						hwVersion: data.hwVersion,
						swVersion: data.swVersion,
					},
					willReportState: data.willReportState,
					attributes: data.attributes,
					otherDeviceIds: data.otherDeviceIds,
					customData: data.customData,
				}

				devices.push(device);
			});

			formatDevices = devices;
		})	
		.catch((err) => {
			console.log('error on searching devices');
		  return { errorCode: 1, text: 'error' };
		});

	return {
		requestId: body.requestId,
		payload: {
			agentUserId: userId,
			devices: formatDevices,
		},
	};
};

module.exports = onSync;
