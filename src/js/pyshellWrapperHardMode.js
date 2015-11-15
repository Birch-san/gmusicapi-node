var PythonShell = require('python-shell');
var _ = require('lodash');
var pathRelToCwd = require('./pathRelToCwd');
var whenError = require('./whenError');
var globalState = require('./globalState');

module.exports = function(config) {
	var shellOptions = _.extend({
        mode: 'json'
	}, config.options || {},
    globalState.pyshellOptions);

    // var sendToPython = _.extend({}, config.pythonMessageObj || {});

    // config.onEndError = config.onEndError || function() {};
    // config.onMessage = config.onMessage || function() {};
    // config.onDone = config.onDone || function() {};

    var relativePath = pathRelToCwd(config.pathRelToRepoRoot);

    var pyshell = new PythonShell(relativePath, shellOptions);

    var output = [];

    // pyshell.send(sendToPython);

    // .on('message', config.onMessage)
    // .end(function (err) {
    //     if (err) {
    //         config.onEndError();
    //         return;
    //     }

    //     config.onDone();
    // });

    return pyshell
};