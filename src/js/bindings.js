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


function init(pyshellOptions) {
	globalState.pyshellOptions = pyshellOptions;
}

function checkSanity() {
	require('./sanitycheck');
}

module.exports = function(options) {
	options = options || {}
	init(options.pyshellOptions || {});

	checkSanity();

	return {};
};