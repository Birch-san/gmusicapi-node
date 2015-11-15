var _ = require('lodash');
var keychain = require('keychain');
var globalState = require('./globalState');
var whenError = require('./whenError');

function init(options) {
	_.merge(globalState, {
		logLevel: 'info',
		credentials: {
			usekeychain: false,
			keychainSpec: {
				account: undefined,
				service: 'accounts.google.com',
				type: 'internet'
			}
		},
		pyshellOptions: {},
	}, options);

	if (globalState.credentials.usekeychain) {
		globalState.credentials.keychainSpec.account = globalState.credentials.keychainSpec.account
		|| globalState.credentials.email;

		if (!globalState.credentials.keychainSpec.account) {
			throw new Error("No `account` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.service) {
			throw new Error("No `service` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.type) {
			throw new Error("No `type` specified in `options.credentials.keychainSpec`!");
		}
	}
}

var sanityCheckPromise;
function checkSanity() {
	if (globalState.skipSanityChecks) {
		sanityCheckPromise = Promise.resolve();
	}

	if (!sanityCheckPromise) {
		sanityCheckPromise = require('./checks/sanityCheck')()
		.then(require('./checks/versionCheck'))
		.then(require('./checks/jsonCheck'))
		.then(require('./checks/libCheck'))
		.catch(whenError.handle);
	}

	return sanityCheckPromise;
}

var passwordPromise;
function getPassword() {
	if (!globalState.credentials.usekeychain) {
		passwordPromise = Promise.resolve();
	}
	if (!passwordPromise) {
		passwordPromise = new Promise(function(resolve, reject) {
			keychain.getPassword(globalState.credentials.keychainSpec, function(err, password) {
				if (err) {
					reject(err);
					return;
				}
				globalState.credentials.password = password;
				globalState.credentials.email = globalState.credentials.email
				|| globalState.credentials.keychainSpec.account;

				resolve();
			});
		});
	}

	return passwordPromise;
}

var checkCredentialsPromise;
function checkCredentials() {
	if (!checkCredentialsPromise) {
		checkCredentialsPromise = new Promise(function(resolve, reject) {
			if (!globalState.credentials.email) {
				reject(new Error("No `email` was found within the `options.credentials` object."));
				return;
			}
			if (!globalState.credentials.password) {
				reject(new Error("No `password` was found within the `options.credentials` object."));
				return;
			}
			resolve();
		});
	}
	return checkCredentialsPromise;
}

module.exports = function(options) {
	init(options || {});

	var bindings = require('./bindings');

	var returnedBindings = _.mapValues(bindings, function(binding) {
		return function() {
			return checkSanity()
			.then(getPassword)
			.then(checkCredentials)
			.then(binding)
		}
	});

	return returnedBindings;
};