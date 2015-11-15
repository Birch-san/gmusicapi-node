var path = require('path');
var util = require('util');
var pyshellWrapper = require('../pyshellWrapper');
var worker = require('../worker');

var repoRoot = path.resolve(__dirname, '../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'checks/versionCheck.py');

worker
.enqueue(new Promise(function(resolve, reject) {
	function qualifyNominalError(nominalErrorText) {
		return util.format("Python version check failed; %s",
			nominalErrorText
			);
	}

	function resultCallback(results) {
		if (!results) {
			throw new Error(qualifyNominalError("empty response received from trivial Python script."));
		}

		var help = "You can point to a different `python` executable by configuring `gmusicapi-node`'s `options` object to include a `pythonPath` pointing to your preferred Python executable.";

		var expectedMajor = 2;
		var actualMajor = +results[0];
		if (actualMajor !== expectedMajor) {
			throw new Error(qualifyNominalError(util.format("Python script was executed with a Major version of Python which we assert is unsupported by gmusicapi.\nExpected: %d; received: %d.\n%s",
				expectedMajor,
				actualMajor,
				help
				)));
		}

		var expectedMinor = 7;
		var actualMinor = +results[1];
		if (actualMinor < expectedMinor) {
			throw new Error(qualifyNominalError(util.format("Python script (Major version %d) was executed with a Minor version of Python which we assert is unsupported by gmusicapi.\nExpected: >= %d; received: %d.\n%s",
				actualMajor,
				expectedMinor,
				actualMinor,
				help
				)));
		}

		console.log('Python version check succeeded; we are executing this script with a supported version of Python (we support ~2.7).');
		require('./jsonCheck')
		resolve();
	}

	var generalErrorText = qualifyNominalError("was unable to invoke trivial Python script.");

	pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText);
}));