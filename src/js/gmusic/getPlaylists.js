var Promise = require('bluebird');
var path = require('path');
var util = require('util');
var pyshellWrapper = require('../pyshellWrapper');
var flog = require('../flog');

var repoRoot = path.resolve(__dirname, '../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'gmusic/getPlaylists.py');

module.exports = function getPlaylists() {
	return new Promise(function(resolve, reject) {
		function qualifyNominalError(nominalErrorText) {
			return util.format("getPlaylists() failed; %s",
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

			resolve(result);
			// flog.info('Python `gmusicapi` import succeeded; we are able to import the `gmusicapi` Python module.');
		}

		var generalErrorText = qualifyNominalError("was unable to invoke Python script.");

		var shellOptions = {
			mode: 'json',
			args: ['sup, yo']
		};

		pyshellWrapper(pathToPythonScript, resultCallback, generalErrorText, shellOptions);
	});
};