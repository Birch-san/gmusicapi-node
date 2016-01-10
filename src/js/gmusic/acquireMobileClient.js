var Promise = require('bluebird');
// var Queue = require('promise-queue');
// Queue.configure(Promise);
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

module.exports = function() {
	var pyshell = pyshellWrapper({
		pathRelToRepoRoot: pathToPythonScript,
		options: {
			mode: 'json'
		}
	});

	var daemon = {
		currentAction: undefined,
		deferred: undefined,
		done: function() {
			var deferred = Promise.pending();
			pyshell.end(deferred.resolve.bind(deferred));
			return deferred.promise;
		},
		sendMessage: function(message) {
			return ((daemon.deferred && daemon.deferred.promise) || Promise.resolve())
			.then(function() {
				daemon.currentAction = message.action;
				daemon.deferred = Promise.pending();

				pyshell.send(message);

				return daemon.deferred.promise;
			});
		}
	};

	function endMessage(err) {
		if (err) {
			daemon.deferred.reject(err);
			return;
		}
	}

	pyshell
	.on('close', function(err) {
		if (err) {
			daemon.deferred.reject({
				err: err
			});
			return;
		}
		daemon.deferred.resolve({
			action: "close"
		});
	})
	.on('error', function(err) {
		daemon.deferred.reject({
			err: err
		});
	})
	.on('message', function(response) {
		console.log("response: ", response);
		if (!response.outcome) {
			daemon.deferred.reject({
				err: "Response from Python did not conform to agreed protocol."
			});
			return;
		}
		switch(response.action) {
			case daemon.currentAction:
			break;
			default:
			daemon.deferred.reject({
				err: util.format("Daemon broke protocol by replying regarding an action '%s', which differs from the action currently enqueued ('%s').", response.action, daemon.currentAction)
			});
		}
		switch(response.outcome) {
			case 'success':
				console.log("success: ", response);
				// daemon successfully initialized
				daemon.deferred.resolve(require('./mobileClient/bindings')(daemon));
				break;
			case 'failure':
				daemon.deferred.reject({
					err: util.format("API request failed. Reason: %s", response.reason)
				});
				return;
			case 'error':
				daemon.deferred.reject({
					err: util.format("Python script ended with error: %s", response.reason)
				});
				return;
			default:
				daemon.deferred.reject({
					err: util.format("Unrecognised outcome: %s", response.outcome)
				});
				return;
		}
	});

	return daemon.sendMessage({
		action: "open",
		email: globalState.credentials.email,
		password: globalState.credentials.password
	});
};