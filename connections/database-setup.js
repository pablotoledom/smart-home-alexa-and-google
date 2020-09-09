let databaseSetup;

if (process.env.ENVIROMENT === 'PRODUCTION') {
  databaseSetup = 'mongodb://user:password@localhost/smarthome';
} else if (process.env.ENVIROMENT === 'REMOTE') {
	databaseSetup = 'mongodb://user:password@yourDomain/smarthome';
} else if (process.env.ENVIROMENT === 'IN_NETWORK') {
	databaseSetup = 'mongodb://user:password@serverIP/smarthome';
} else {
	databaseSetup = 'mongodb://user:password@localhost/smarthome';
}

module.exports = databaseSetup;