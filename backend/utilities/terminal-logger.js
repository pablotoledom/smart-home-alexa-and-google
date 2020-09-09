
const terminalLogger = (req, res, next) => {
	const oldWrite = res.write,
		oldEnd = res.end;

	const chunks = [];

	res.write = function (chunk) {
		chunks.push(chunk);

		oldWrite.apply(res, arguments);
	};

	res.end = function (chunk) {
		console.log('\n-----------', req.method, ' => ', req.url, '-----------')
		console.log('request.body => ', req.body);
		console.log('request.headers => ', req.headers);
		if (chunk) {
			chunks.push(chunk);

			try {
				const body = Buffer.concat(chunks).toString('utf8');
				console.log('response.body => ', JSON.parse(body), '\n');
			} catch (e) {
					// console.log(chunks);
			}
		}

		oldEnd.apply(res, arguments);
	};

	next();
}

module.exports = terminalLogger;