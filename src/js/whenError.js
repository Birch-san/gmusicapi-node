var util = require('util');

var self = {
	toError: function toError(err) {
		if (err instanceof Error) {
			return err;
		}
		return new Error(err);
	},
	prependToErrorMessage: function prependToErrorMessage(err, preamble) {
		if (preamble) {
			err.message = util.format(
				"%s Error message was:\n%s",
				err.message,
				preamble
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