var Promise = require("bluebird");
var whenError = require('./whenError');

var state = {
	promise: undefined
};

module.exports = {
	enqueue: function enqueue(promise) {
		if (state.promise) {
			state.promise
			.then(promise)
		} else {
			state.promise = promise;
		}

		return state.promise
		.catch(whenError);
	}
}