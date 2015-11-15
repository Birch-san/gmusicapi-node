var path = require('path');
var util = require('util');
var whenError = require('./whenError');
var pyshellWrapper = require('./pyshellWrapper');
var worker = require('./worker');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'versioncheck.py');

worker
.enqueue(new Promise(function(resolve, reject) {
	function qualifyNominalError(nominalErrorText) {
		return util.format("Version check failed; %s",
			nominalErrorText
			);
	}

	function resultCallback(results) {
		if (!results) {
			throw new Error(qualifyNominalError("empty response received from trivial Python script."));
		}
		var expectedMessage = "sup, yo";
		var actualMessage = results[0];
		if (actualMessage !== "sup, yo") {
			throw new Error(qualifyNominalError(util.format("malformed response received from trivial Python script.\nExpected: %s; received: %s.",
				expectedMessage,
				actualMessage
				)));
		}

		
	}

	var generalErrorText = qualifyNominalError("was unable to invoke trivial Python script.");

	pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText);
}));