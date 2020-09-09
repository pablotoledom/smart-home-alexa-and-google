const onDisconnect = async (body, headers) => {
	const userId = await getUserIdOrThrow(headers)
	await Firestore.disconnect(userId)
};

module.exports = onDisconnect;