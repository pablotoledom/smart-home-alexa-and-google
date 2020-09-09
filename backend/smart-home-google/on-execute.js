const model = require('../../database/model.js');
const asyncForEach = require('../utilities/async-for-each.js');
const dbExecute = require('./db-execute.js');

const onExecute = async (body, headers, server) => {
	const userId = server.express.response.locals.oauth.token.user.username;
	const commands = [];
	const successCommand = {
		ids: [],
		status: 'SUCCESS',
		states: {},
	};

	const { devices, execution } = body.inputs[0].payload.commands[0];
	await asyncForEach(devices, async (device) => {
		try {
			const states = await dbExecute(userId, device.id, execution[0]);
			successCommand.ids.push(device.id)
			successCommand.states = states

			// TODO: revisar si es necesario este reporte
			// Report state back to Homegraph
			// await mySmartHome.reportState({
			// 	agentUserId: userId,
			// 	requestId: Math.random().toString(),
			// 	payload: {
			// 		devices: {
			// 			states: {
			// 				[device.id]: states,
			// 			},
			// 		},
			// 	},
			// });
		} catch (e) {
			if (e.message === 'pinNeeded') {
				commands.push({
					ids: [device.id],
					status: 'ERROR 1',
					errorCode: 'challengeNeeded',
					challengeNeeded: {
						type: 'pinNeeded',
					},
				})
				return
			} else if (e.message === 'challengeFailedPinNeeded') {
				commands.push({
					ids: [device.id],
					status: 'ERROR 2',
					errorCode: 'challengeNeeded',
					challengeNeeded: {
						type: 'challengeFailedPinNeeded',
					},
				})
				return
			} else if (e.message === 'ackNeeded') {
				commands.push({
					ids: [device.id],
					status: 'ERROR 3',
					errorCode: 'challengeNeeded',
					challengeNeeded: {
						type: 'ackNeeded',
					},
				})
				return
			}
			commands.push({
				ids: [device.id],
				status: 'ERROR 4',
				errorCode: e.message,
			})
		}
	});

	if (successCommand.ids.length) {
		commands.push(successCommand)
	}

	return {
		requestId: body.requestId,
		payload: {
			commands,
		},
	}
};

module.exports = onExecute;