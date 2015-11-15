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
}

var sanityChecked = false;
function checkSanity() {
	if (sanityChecked) {
		return Promise.resolve();
	}
	sanityChecked = true;
	return require('./checks/sanityCheck')()
	.then(require('./checks/versionCheck'))
	.then(require('./checks/jsonCheck'))
	.then(require('./checks/libCheck'))
	.catch(whenError.handle);
}

var passwordGotten = false;
function getPassword() {
	if (passwordGotten) {
		return Promise.resolve();
	}
	return new Promise(function(resolve, reject) {
		keychain.getPassword(globalState.credentials.keychainSpec, function(err, password) {
			if (err) {
				reject(err);
				return;
			}
			globalState.credentials.password = password;

			resolve();
		});
	})
}

module.exports = function(options) {
	init(options || {});

	var bindings = require('./bindings');

	var returnedBindings = bindings;

	if (!globalState.skipSanityChecks){
		returnedBindings = _.mapValues(returnedBindings, function(binding) {
			return function() {
				return checkSanity()
				.then(function() {
					return binding.apply(binding, arguments);
				})
			}
		});
	}

	if (globalState.credentials.usekeychain) {
		globalState.credentials.keychainSpec.account = globalState.credentials.keychainSpec.account || globalState.credentials.email;

		if (!globalState.credentials.keychainSpec.account) {
			throw new Error("No `account` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.service) {
			throw new Error("No `service` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.type) {
			throw new Error("No `type` specified in `options.credentials.keychainSpec`!");
		}

		returnedBindings = _.mapValues(returnedBindings, function(binding) {
			return function() {
				return getPassword()
				.then(function() {
					return binding.apply(binding, arguments);
				});

			}
		});
	}

	return returnedBindings;
};