var path = require('path');
var util = require('util');
var _ = require('lodash');
var whenError = require('./whenError');
var pyshellWrapper = require('./pyshellWrapper');
var worker = require('./worker');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'libcheck.py');

worker
.enqueue(new Promise(function(resolve, reject) {
	function qualifyNominalError(nominalErrorText) {
		return util.format("Python `gmusicapi` import failed; %s",
			nominalErrorText
			);
	}

	function resultCallback(results) {
		if (!results) {
			throw new Error(qualifyNominalError("empty response received from Python script."));
		}

		var result = results[0];
		if (!result) {
			throw new Error(qualifyNominalError("no message received from Python script."));
		}

		var outcomeKey = 'outcome';
		var expectedKey = outcomeKey;
		if (!_.has(result, expectedKey)) {
			throw new Error(qualifyNominalError(util.format("unexpected object unserialized from Python script.\nExpected to contain key: '%s'; received: %s.",
				expectedKey,
				JSON.stringify(unserialized)
				)));
		}

		var outcome = result[outcomeKey];
		switch(outcome) {
			case 'success':
			break;
			case 'failure':
				throw new Error(qualifyNominalError(util.format("Python encountered ImportError when importing module `gmusicapi`.\nPython searches for modules in at least the directories described in the PYTHONPATH of the environment within which this file was invoked; these directories were found to be:\n[%s].\nYou can change this list of directories by configuring `gmusicapi-node`'s `options.pyshellOptions` object to include an `env` object containing a `PYTHONPATH`; see the README for details.",
				result['lookuppaths'].join(", ")
				)));
			default:
				throw new Error(qualifyNominalError(util.format("unexpected outcome described in object unserialized from Python script.\nExpected to be either 'success' or 'failure'; received: %s.",
					outcome)
				));
		}
		// require('./versioncheck')
		resolve();
		console.log('Python `gmusicapi` import succeeded; we are able to import the `gmusicapi` Python module.');
	}

	var generalErrorText = qualifyNominalError("was unable to invoke Python script.");

	var shellOptions = {
		mode: 'json'
	};

	pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText, shellOptions);
}));