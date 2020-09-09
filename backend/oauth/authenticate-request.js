const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const authenticateRequest = (req, res, next) => {
const request = new Request(req);
const response = new Response(res);

	return req.app.oauth.authenticate(request, response)
		.then(function (token) {
			response.locals.oauth = { token: token };
			next();
		}).catch(function (err) {

			res.status(err.code || 500).json(err);
		});
};

module.exports = authenticateRequest;