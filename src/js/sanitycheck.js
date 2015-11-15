var path = require('path');
var whenError = require('./whenError');
var pyshellWrapper = require('./pyshellWrapper');
var worker = require('./worker');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var sanityChecker = path.resolve(pyDir, 'sanitycheck.py');

worker
.enqueue(new Promise(function(resolve, reject) {
	function resultCallback(results) {
		if (results && results[0] == "sup, yo") {
			// console.log(results);
			resolve();
			console.log('Sanity check succeeded; was able to invoke trivial Python script');
		} else {
			throw new Error("Sanity check failed; was unable to invoke trivial Python script.");
		}
	}

	pyshellWrapper(sanityChecker, resultCallback);
}));