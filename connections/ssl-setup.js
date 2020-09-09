const privateKey = () => fs.readFileSync('/home/yourUser/letsencrypt/config/live/yourDomain/privkey.pem', 'utf8');
const certificate = () => fs.readFileSync('/home/yourUser/letsencrypt/config/live/yourDomain/cert.pem', 'utf8');
const ca = () => fs.readFileSync('/home/yourUser/letsencrypt/config/live/yourDomain/chain.pem', 'utf8');

module.exports = {
	privateKey,
  certificate,
  ca,
}