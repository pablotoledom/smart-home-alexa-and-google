const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const passwordToAuthorizationCode = (req, res, next) => {
	const request = new Request(req);

	if (request.body.grant_type === 'authorization_code') {
		const userPass = Buffer.from(request.body.code, 'base64').toString().split(':');
		request.body['grant_type'] = 'password';
		request.body['username'] = userPass[0];
		request.body['password'] = userPass[1];
	}
	next();
}

module.exports = passwordToAuthorizationCode;