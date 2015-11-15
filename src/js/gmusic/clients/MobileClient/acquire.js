var Promise = require('bluebird');
var path = require('path');
var util = require('util');
var globalState = require('../../../globalState');
var pyshellWrapper = require('../../../pyshellWrapperHardMode');
var flog = require('../../../flog');

var repoRoot = path.resolve(__dirname, '../../../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'gmusic/clients/MobileClient/acquire.py');
// console.log(pathToPythonScript);

module.exports = function getPlaylists() {
	return new Promise(function(resolve, reject) {
		var pyshell = pyshellWrapper({
			pathRelToRepoRoot: pathToPythonScript,
			options: {
				mode: 'json'
			}
		});

		function endMessage(err) {
			if (err) {
				reject(err);
				return;
			}
		}

		pyshell
		.on('close', function(err) {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		})
		.on('error', function(err) {
			reject(err);
		})
		.on('message', function(response) {
			console.log("response: ", response);
			if (!response.outcome) {
				reject("Response from Python did not conform to agreed protocol.");
				return;
			}
			switch(response.outcome) {
				case 'success':
					console.log("success: ", response);
					break;
				case 'failure':
					reject(util.format("API request failed. Reason: %s", response.reason));
					return;
				case 'error':
					reject(util.format("Python script ended with error: %s", response.reason));
					return;
				default:
					reject(util.format("Unrecognised outcome: %s", response.outcome));
					return;
			}
		})
		.send({
			action: 'acquire',
			email: globalState.credentials.email,
			password: globalState.credentials.password
		})
		.end(endMessage);

	});
};