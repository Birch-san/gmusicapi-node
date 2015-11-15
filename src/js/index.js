var _ = require('lodash');
var globalState = require('./globalState');

function init(options) {
	_.merge(globalState, {
		logLevel: 'info'
	}, options);
}

function checkSanity() {
	require('./checks/sanityCheck');
}

module.exports = function(options) {
	init(options || {});

	if (!globalState.skipSanityChecks){
		checkSanity();
	}

	return require('./bindings');
};