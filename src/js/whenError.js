var util = require('util');

function toError(err) {
	if (err instanceof Error) {
		return err;
	}
	return new Error(err);
}

module.exports = function(err, contextText) {
	var error = toError(err);

	if (contextText) {
		error.message = util.format(
			"%s Error message was:\n%s",
			error.message,
			contextText
			)
	}

	throw error;
};