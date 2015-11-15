var path = require('path');
var util = require('util');
var _ = require('lodash');
var whenError = require('./whenError');
var pyshellWrapper = require('./pyshellWrapper');
var worker = require('./worker');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'jsoncheck.py');

worker
.enqueue(new Promise(function(resolve, reject) {
	function qualifyNominalError(nominalErrorText) {
		return util.format("JSON unserialization check failed; %s",
			nominalErrorText
			);
	}

	function resultCallback(results) {
		if (!results) {
			throw new Error(qualifyNominalError("empty response received from Python script."));
		}
		var expectedObj = {'sup': 'yo'};
		var actualMessage = results[0];
		if (!actualMessage) {
			throw new Error(qualifyNominalError("no message received from Python script."));
		}
		var unserialized = actualMessage;
		if (!_.isEqual(expectedObj, unserialized)) {
			throw new Error(qualifyNominalError(util.format("unexpected object unserialized from Python script.\nExpected to equal: %s; received: %s.",
				JSON.stringify(expectedObj),
				JSON.stringify(unserialized)
				)));
		}
		// require('./versioncheck')
		resolve();
		console.log('JSON unserialization check succeeded; we are able to correctly unserialize JSON provided by Python');
	}

	var generalErrorText = qualifyNominalError("was unable to invoke Python script.");

	var shellOptions = {
		mode: 'json'
	};

	pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText, shellOptions);
}));