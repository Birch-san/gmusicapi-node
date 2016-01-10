var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(daemon) {
	// return _.mapValues({
	// 	getPlaylists: require('./getPlaylists')
	// }, function(nominalFunc) {
	// 	console.log('yo');
	// 	// return new Promise(function(resolve, reject) {
	// 	// 	daemon.send();
	// 	// });
	// 	return Promise.resolve();
	// });

	return {
		done: daemon.done
	};
};