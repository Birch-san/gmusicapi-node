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
				service: 'https://accounts.google.com/ServiceLogin',
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

module.exports = function(options) {
	init(options || {});

	var bindings = require('./bindings');

	var returnedBindings = bindings;

	if (!globalState.skipSanityChecks){
		returnedBindings = _.mapValues(bindings, function(binding) {
			return function() {
				return checkSanity()
				.then(function() {
					return binding.apply(binding, arguments);
				})
			}
		});
	}

	if (globalState.credentials.usekeychain) {
		if (!globalState.credentials.keychainSpec.account) {
			throw new Error("No `account` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.service) {
			throw new Error("No `service` specified in `options.credentials.keychainSpec`!");
		}
		if (!globalState.credentials.keychainSpec.type) {
			throw new Error("No `type` specified in `options.credentials.keychainSpec`!");
		}

		return new keychain.getPassword(globalState.credentials.keychainSpec, function(err, pass) {
			if (err) {
				console.error(err);
			} else {
				console.log(pass);
			}
		});
	}

	return returnedBindings;
};