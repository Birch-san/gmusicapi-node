var path = require('path');

var repoRoot = path.resolve(__dirname, '../../');

var srcDir = path.resolve(repoRoot, 'src');
var pyDir = path.resolve(srcDir, 'py');
var sanityChecker = path.resolve(pyDir, 'sanitycheck.py');

var PythonShell = require('python-shell');

function pathRelToCwd(absPath) {
	return path.relative(process.cwd(), absPath);
}

var shellOptions = {};

// var pyshell = new PythonShell(pathRelToCwd(sanityChecker));

// pyshell.on('message', function (message) {
//   // received a message sent from the Python script (a simple "print" statement)
//   console.log(message);
// });

// // end the input stream and allow the process to exit
// pyshell.end(function (err) {
//   if (err) {
//   	throw err;
//   }
//   console.log('finished');
// });

PythonShell.run(
	pathRelToCwd(sanityChecker),
	shellOptions,
	function (err, results) {
	if (err) {
		throw err;
	}
	console.log(results);
	console.log('finished');
});

module.exports = {};