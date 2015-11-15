var util = require('util');

var self = {
	toError: function toError(err) {
		if (err instanceof Error) {
			return err;
		}
		return new Error(err);
	},
	prependToErrorMessage: function prependToErrorMessage(err, preamble) {
		if (contextText) {
			error.message = util.format(
				"%s Error message was:\n%s",
				error.message,
				contextText
				)
		}
	},
	handle: function handle(err, contextText) {
		var error = self.toError(err);

		self.prependToErrorMessage(err, contextText);

		throw error;
	}
};
module.exports = self;