var Promise = require('bluebird');
var util = require('util');
var _ = require('lodash');

module.exports = {
	onSuccess: function(response) {
		return response;
	},
	onFail: function(err) {
		console.log("getPlaylists failure: ", err.detail);
	},
	act: function() {
		return {
			action: 'getPlaylists'
		}
	}
};