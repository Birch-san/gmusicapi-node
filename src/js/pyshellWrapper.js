var PythonShell = require('python-shell');
var _ = require('lodash');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');
var globalState = require('./globalState');

module.exports = function(pathRelToRepoRoot, resultCallback, generalErrorText, options) {
	var shellOptions = _.extend({
	}, options || {}, globalState.pyshellOptions);

	var relativePath = pathRelToCwd(pathRelToRepoRoot);
	return PythonShell.run(
		relativePath,
		shellOptions,
		function (err, results) {
		if (err) {
			whenError.handle(err, generalErrorText);
		}
		resultCallback(results);
		// console.log('finished');
		}
	);
};