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

		pyshell
		.on('message', function() {
			console.log(arguments);
		})
		.send({
			email: globalState.credentials.email,
			password: globalState.credentials.password
		})
		.end(function(err) {
			if (err) {
				reject(err);
				return;
			}
			// console.log(arguments);
		});

	});
};