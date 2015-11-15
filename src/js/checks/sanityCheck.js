var Promise = require('bluebird');
var path = require('path');
var util = require('util');
var pyshellWrapper = require('../pyshellWrapper');
var flog = require('../flog');

var globalState = require('../globalState');

var repoRoot = path.resolve(__dirname, '../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'checks/sanityCheck.py');

module.exports = function() {
	return new Promise(function(resolve, reject) {
		function qualifyNominalError(nominalErrorText) {
			return util.format("Sanity check failed; %s",
				nominalErrorText
				);
		}

		function resultCallback(results) {
			if (!results) {
				throw new Error(qualifyNominalError("empty response received from Python script."));
			}
			var expectedMessage = "sup, yo";
			var actualMessage = results[0];
			if (actualMessage !== expectedMessage) {
				throw new Error(qualifyNominalError(util.format("malformed response received from Python script.\nExpected: %s; received: %s.",
					expectedMessage,
					actualMessage
					)));
			}
			flog.info('Sanity check succeeded; was able to invoke Python script');
			resolve();
		}

		var generalErrorText = qualifyNominalError("was unable to invoke Python script.");

		pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText);
	});
};