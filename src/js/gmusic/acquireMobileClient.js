var Promise = require('bluebird');
var path = require('path');
var util = require('util');
var _ = require('lodash');
var globalState = require('../globalState');
var pyshellWrapper = require('../pyshellWrapperHardMode');
var flog = require('../flog');

var repoRoot = path.resolve(__dirname, '../../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var pathToPythonScript = path.resolve(pyDir, 'gmusic/mobileClient/daemon.py');
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

		var shellState = {
			currentAction: "open"
		};

		pyshell
		.on('close', function(err) {
			if (err) {
				reject({
					action: "close",
					err: err
				});
				return;
			}
			resolve({
				action: "close"
			});
		})
		.on('error', function(err) {
			reject({
				action: shellState.currentAction,
				err: err
			});
		})
		.on('message', function(response) {
			console.log("response: ", response);
			if (!response.outcome) {
				reject({
					action: shellState.currentAction,
					err: "Response from Python did not conform to agreed protocol."
				});
				return;
			}
			switch(response.action) {
				case shellState.currentAction:
				break;
				default:
				reject({
					action: shellState.currentAction,
					err: util.format("Daemon broke protocol by replying regarding an action '%s', which differs from the action currently enqueued ('%s').", response.action, shellState.currentAction)
				});
			}
			switch(response.outcome) {
				case 'success':
					console.log("success: ", response);
					// daemon successfully initialized
					resolve({
						action: shellState.currentAction,
						shell: pyshell
					});
					break;
				case 'failure':
					reject({
						action: shellState.currentAction,
						err: util.format("API request failed. Reason: %s", response.reason)
					});
					return;
				case 'error':
					reject({
						action: shellState.currentAction,
						err: util.format("Python script ended with error: %s", response.reason)
					});
					return;
				default:
					reject({
						action: shellState.currentAction,
						err: util.format("Unrecognised outcome: %s", response.outcome)
					});
					return;
			}
		})
		.send({
			action: shellState.currentAction,
			email: globalState.credentials.email,
			password: globalState.credentials.password
		});

	});
};