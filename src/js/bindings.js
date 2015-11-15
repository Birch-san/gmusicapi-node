var _ = require('lodash');
var globalState = require('./globalState');

// var pyshell = new PythonShell(pathRelToCwd(sanityChecker));

// pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log(message);
// });

// // end the input stream and allow the process to exit
// pyshell.end(function (err) {
//   if (err) {
//   	throw err;
//   }
//   console.log('finished');
// });

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

	checkSanity();

	return {};
};