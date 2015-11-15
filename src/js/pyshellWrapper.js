var PythonShell = require('python-shell');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');

module.exports = function(pathRelToRepoRoot, resultCallback, generalErrorText) {
	var shellOptions = {};

	var relativePath = pathRelToCwd(pathRelToRepoRoot);
	return PythonShell.run(
		relativePath,
		shellOptions,
		function (err, results) {
		if (err) {
			whenError(err, generalErrorText);
		}
		resultCallback(results);
		// console.log('finished');
		}
	);
};