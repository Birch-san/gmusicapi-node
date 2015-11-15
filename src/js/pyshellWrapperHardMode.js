var PythonShell = require('python-shell');
var _ = require('lodash');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');
var globalState = require('./globalState');

module.exports = function(config) {
	var shellOptions = _.extend({
	}, config.options || {},
    globalState.pyshellOptions);

    var relativePath = pathRelToCwd(config.pathRelToRepoRoot);

    var pyshell = new PythonShell(relativePath, shellOptions);
    return pyshell;
};