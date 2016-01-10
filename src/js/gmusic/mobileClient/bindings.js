var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function(daemon) {
	return _.extend(_.mapValues({
		getPlaylists: require('./getPlaylists')
	}, function(nominalFunc) {
		return function() {
			return daemon.sendMessage(nominalFunc.act())
			.catch(function(err) {
				if (err.nature === "failure") {
					return nominalFunc.onFail(err);
				}
				throw err;
			})
			.then(function(response) {
				return nominalFunc.onSuccess(response);
			});
		};
	}),
		{
			done: daemon.done
		}
	);
};