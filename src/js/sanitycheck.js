var path = require('path');
var whenError = require('./whenError');
var pyshellWrapper = require('./pyshellWrapper');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var sanityChecker = path.resolve(pyDir, 'sanitycheck.py');

function resultCallback(results) {
	if (results && results[0] == "sup, yo") {
		// console.log(results);
		console.log('Sanity check succeeded; was able to invoke trivial Python script');
	} else {
		throw new Error("Sanity check failed; was unable to invoke trivial Python script.");
	}
}

pyshellWrapper(sanityChecker, resultCallback);