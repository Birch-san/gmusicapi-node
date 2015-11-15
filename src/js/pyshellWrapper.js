var PythonShell = require('python-shell');
var _ = require('lodash');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');
var globalState = require('./globalState');

var pyshellWrapperHardMode = require('./pyshellWrapperHardMode');

module.exports = function(pathRelToRepoRoot, resultCallback, generalErrorText, options) {
	var config = {
		options: options,
		pathRelToRepoRoot: pathRelToRepoRoot
	};

	var output = [];
	return pyshellWrapperHardMode(config)
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