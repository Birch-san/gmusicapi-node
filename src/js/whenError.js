function toError(err) {
	if (err instanceof Error) {
		return err;
	}
	return new Error(err);
}

module.exports = function(err) {
	var error = toError(err);
	throw error;
};