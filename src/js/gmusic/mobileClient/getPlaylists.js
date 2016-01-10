var Promise = require('bluebird');
var util = require('util');
var _ = require('lodash');

module.exports = {
	successHandler: function(response) {
		console.log("getPlaylists success: ", response);
	},
	failureHandler: function(response) {
		console.log("getPlaylists failure: ", response);
	},
	act: function() {
		return {
			action: 'getPlaylists'
		}
	}
};