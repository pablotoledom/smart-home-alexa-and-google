const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const obtainToken = (req, res) => {
	console.log('Obtain Token');
	var request = new Request(req);
	var response = new Response(res);
	var secondsToExpire = function (expiracionAt) {
		var fromTime = new Date();
		var toTime = new Date(expiracionAt);

		var differenceTravel = toTime.getTime() - fromTime.getTime();
		return Math.floor((differenceTravel) / (1000));
	}

	return req.app.oauth.token(request, response)
		.then(function (token) {
			res.json({
				...token,
				token_type: "bearer",
				access_token: token.accessToken,
				refresh_token: token.refreshToken,
				expires_in: secondsToExpire(token.accessTokenExpiresAt),
			});
		}).catch(function (err) {
			res.status(err.code || 500).json(err);
		});
}

module.exports = obtainToken;