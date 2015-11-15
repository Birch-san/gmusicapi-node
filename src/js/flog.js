var util = require('util');
var globalState = require('./globalState');

var logLevel = globalState.logLevel;

function format() {
	var formatted = util.format.apply(null, arguments);
	return formatted;
}

module.exports = {
	info: function() {
		var formatted = format.apply(null, arguments);
		switch (logLevel) {
			case 'info':
			console.log(formatted);
			break;
			default:
			break;
		}
	}
}