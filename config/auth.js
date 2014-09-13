// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: 'your-secret-clientID-here', // your App ID
		'clientSecret' 	: 'your-client-secret-here', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '221114642655-8uqtup49r8ujui2rqu3d234ovj8ou129.apps.googleusercontent.com',
		'clientSecret' 	: 'jIAnlc5FsKtwhBlJrUABxmtq',
		'callbackURL' 	: 'http://127.0.0.1:8080/auth/google/callback'
	}

};