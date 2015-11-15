var path = require('path');
module.exports = function pathRelToCwd(absPath) {
	return path.relative(process.cwd(), absPath);
};