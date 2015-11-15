var PythonShell = require('python-shell');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');

module.exports = function(pathRelToRepoRoot, resultCallback) {
	var shellOptions = {};

	var relativePath = pathRelToCwd(pathRelToRepoRoot);
	return PythonShell.run(
		relativePath,
		shellOptions,
		function (err, results) {
		if (err) {
			whenError(err);
		}
		resultCallback(results);
		// console.log('finished');
		}
	);
};