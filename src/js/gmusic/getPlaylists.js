var Promise = require('bluebird');
var path = require('path');
var util = require('util');
var globalState = require('../globalState');
var pyshellWrapper = require('../pyshellWrapperHardMode');
var flog = require('../flog');

var repoRoot = path.resolve(__dirname, '../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'gmusic/getPlaylists.py');
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

		// function ender(err) {
		// 	if (err) {
		// 		reject(err);
		// 		return;
		// 	}
		// 	// resolve();
		// };

		// function pyEnder(err) {
		// 	if (err) {
		// 		reject(new Error(err));
		// 	}
		// 	pyshell.end(ender);
		// }

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
			// var parsed;
			// try {
			// 	parsed = JSON.parse(response);
			// } catch(err) {
			// 	pyEnder("JSON parse failure.");
			// 	return;
			// }

			var parsed = response;

			console.log("response: ", parsed);
			if (!parsed.nature) {
				console.error("Response from Python did not conform to agreed protocol.");
					pyshell
					.end(endMessage);
				return;
			}
			switch(parsed.nature) {
				case 'ACK':
					switch(parsed.action) {
						case 'credentials':
							console.log("cred", parsed);
							pyshell.send({
								action: 'act'
							})
							.end(endMessage);
							break;
						case 'act':
							console.log("act", parsed);
							pyshell
							.end(endMessage);
							resolve();
						break;
					}
					break;
				case 'error':
					console.error(util.format("Python script ended with error: %s", parsed.reason));
					pyshell
					.end(endMessage);
					return;
			}
		})
		.send({
			action: 'credentials',
			email: globalState.credentials.email,
			password: globalState.credentials.password
		})
		.end(endMessage);

	});
};