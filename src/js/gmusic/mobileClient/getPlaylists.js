var Promise = require('bluebird');
var util = require('util');
var _ = require('lodash');

module.exports = {
	onSuccess: function(response) {
		console.log("getPlaylists success: ", response);
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