const express = require('express'),
	bodyParser = require('body-parser'),
	OAuth2Server = require('oauth2-server'),
	model = require('./database/model.js'),
	mySmartHomeGoogle = require('./backend/smart-home-google/index.js'),
	mySmartHomeAmazon = require('./backend/smart-home-amazon/index.js'),
	passwordToAc = require('./backend/oauth/password-to-ac.js'),
	obtainToken = require('./backend/oauth/obtain-token.js'),
	authenticateRequest = require('./backend/oauth/authenticate-request.js'),
	devicesService = require('./backend/services/devices.js'),
	hubsService = require('./backend/services/hubs.js'),
	profileService = require('./backend/services/profile.js'),
	sslSetup = require('./connections/ssl-setup.js'),
	https = require('https')
	fs = require('fs');

const app = express();


// ********* SSL CERTIFICATES *********
let httpsServer;
if (process.env.ENVIROMENT === 'PRODUCTION') {
	const privateKey = sslSetup.privateKey();
	const certificate = sslSetup.certificate();
	const ca = sslSetup.ca();
	
	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca
	};
	httpsServer = https.createServer(credentials, app);
}

// ********* EXPRESS UTILITIES *********
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(terminaLogger);

// ********* STATIC FILES *********
app.use(express.static(__dirname + '/build/esm-bundled'));

// ********* INDEX FILE TO RENDER *********
app.get('/', function (req, res) {
	res.sendFile("/build/esm-bundled/index.html", { root: '.' });
});

// ********* OAUTH AUTHORIZATION SERVER *********
app.oauth = new OAuth2Server({
	model: model,
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

// ********* ENDPOINTS *********
app.all('/api/oauth/token', passwordToAc, obtainToken);
app.post('/api/smarthome/google', authenticateRequest, mySmartHomeGoogle);
app.post('/api/smarthome/amazon', authenticateRequest, mySmartHomeAmazon);
// endpoint for devices
app.get('/api/devices', authenticateRequest, devicesService.getAll);
app.get('/api/devices/:id', authenticateRequest, devicesService.getOne);
app.get('/api/devices/realtime/:id', authenticateRequest, devicesService.getOneInRealtime);
app.post('/api/devices', authenticateRequest, devicesService.create);
app.put('/api/devices/:id', authenticateRequest, devicesService.update);
app.delete('/api/devices/:id', authenticateRequest, devicesService.remove);
// endpoint for hubs
app.get('/api/hubs', authenticateRequest, hubsService.getAll);
app.post('/api/hubs', authenticateRequest, hubsService.create);
app.put('/api/hubs/:id', authenticateRequest, hubsService.update);
app.delete('/api/hubs/:id', authenticateRequest, hubsService.remove);
// endpoint for profile
app.get('/api/profile/:username', authenticateRequest, profileService.get);

app.put('/api/profile/:username', authenticateRequest, profileService.update);
// ********* SERVER PORT *********
app.listen(8080);

if (process.env.ENVIROMENT === 'PRODUCTION') {
	httpsServer.listen(8443, () => {
		console.log('HTTPS Server running on port 443');
	});
}