var PythonShell = require('python-shell');
var _ = require('lodash');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');
var globalState = require('./globalState');

module.exports = function(pathRelToRepoRoot, resultCallback, generalErrorText, options) {
	var shellOptions = _.extend({
	}, options || {}, globalState.pyshellOptions);

	var relativePath = pathRelToCwd(pathRelToRepoRoot);


	var pyshell = new PythonShell(relativePath, shellOptions);

    var output = [];

    return pyshell
    .on('message', function (message) {
        output.push(message);
    })
    .end(function (err) {
        if (err) {
        	whenError.handle(err, generalErrorText);
        	return;
        }

        resultCallback(output.length
        	? output
        	: null);
    });
};