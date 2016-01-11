# Purpose
This Node library should enable you to invoke from Node the functionality of Simon Weber's [Unofficial Google Music API, `gmusicapi`](https://github.com/simon-weber/gmusicapi).

It is _not_ a re-implementation; it binds to existing functionality from the Python module.

The main reason for using this Node module is to stubbornly avoid learning Python.

# Requirements
`2.7 <= Python version < 3.0`

You will need the Python `gmusicapi` to be working already.

[Here's my instructions](Installing Python gmusicapi.md)!

# Installation
Install this Node package to your own Node project.

## Via npm
Sorry, we're not on npm yet~

## Via GitHub
Install this Node package:

```bash
npm install git+ssh://git@github.com:Birch-san/gmusicapi-node.git
```

# Usage
## Inclusion
Include the installed package into your Node script using `require()`.

```js
var gmusicapi = require('gmusicapi-node');
```

## Invocation

### Basic usage
```js
var gmusicapi = require('gmusicapi-node')();

// attempt to acquire a MobileClient
gmusicapi.acquireMobileClient()
.then(function(bindings) {
	// check what functions are exported by this library
	console.log(bindings);

	return bindings
	.getPlaylists()
	.then(function(results) {
		// you'll get an array of playlists
		console.log(results);
	})
	.catch(console.error)
	.finally(bindings.done);
})
.catch(console.error);
```

Example output:

```json
[
{
	kind: 'sj#playlist',
	name: 'かたわ少女',
	deleted: false,
	lastModifiedTimestamp: '1412977187235428',
	recentTimestamp: '1412977136104000',
	shareToken: 'AMaBXykdBzHnRhaVhtpIBrYu6UwQFgaZDOtFL1XTGmMAc6aOEJ4GKvk2ZIVRmPH3m0dZFbTElvznB3b6EcA37NtD0IuHM_hU0w==',
	clientId: '996CEDEF0DFAE259',
	ownerProfilePhotoUrl: '(redacted)',
	ownerName: '(redacted)',
	accessControlled: false,
	creationTimestamp: '1412977136108902',
	id: '8bcfdbb5-b22e-3441-b815-a58d5b53afd9'
}
]
```

### Advanced usage

You can use a non-default configuration like I do:

```js
var options = {
	// these options will be passed to `python-shell`
	pyshellOptions: {
		pythonPath: '/usr/local/bin/python',
		env: {
			// which directories (delimited by : character) Python should inspect when importing modules
			'PYTHONPATH': '/usr/local/lib/python2.7/site-packages'
		}
	},
	credentials: {
		email: 'some.guy@example.com',
		password: 'hey'
	},
	/*
	// or use credentials from keychain, like so:
	credentials: {
		usekeychain: true,
		email: 'some.guy@example.com
	},
	*/
	// skipping sanity checks saves a bit of time, if you're sure your Python environment works
	skipSanityChecks: true
};

var lib = require('../src/js/index')(options);

lib.acquireMobileClient()
.then(function(bindings) {
	return bindings
	.getPlaylists()
	.then(console.log)
	.catch(console.error)
	.finally(bindings.done);
})
.catch(console.error);
```

### Options
If default state doesn't work out for you, `require()` the library with some options

`pyshellOptions` is passed to [`python-shell`](https://github.com/extrabacon/python-shell). Any unrecognised options within this object will be passed through to `child_process.spawn`'s `options` object.

You can assign a `string` to `pyshellOptions.pythonPath` to specify the path to your intended Python executable.

You can assign an `object` of key-value pairs to `pyshellOptions.env` to provide environment variables to `child_process.spawn`.

Here's an example of that:

```js
var options = {
	// these options will be passed to `python-shell`
	pyshellOptions: {
		pythonPath: '/usr/local/bin/python',
		env: {
			// which directories (delimited by : character) Python should inspect when importing modules
			'PYTHONPATH': '/usr/local/lib/python2.7/site-packages'
		}
	}
};

var lib = require('../src/js/index')(options);
```

We also have options for:

Option | type | Description
------ | ---- | -----------
`logLevel` | `string` | Print to `console.log` various verbosity of messages from this library. Defaults to `"info"`. Possible values are: `["info"]`
`skipSanityChecks` | `boolean` | Skip sanity checks on startup
`credentials` | `object` | see `credentials` spec below

`credentials`:

Option | type | Description
------ | ---- | -----------
`usekeychain` | `boolean` | Consult Mac OS X Keychain for your Google account's password _instead_ of specifying `password`. Defaults to `false`.
`email` | `string` | Your Google account
`password` | `string` | Your Google password
`keychainSpec` | `object` | see `keychainSpec` below

`keychainSpec`:

Option | type | Description
------ | ---- | -----------
`account` | `string` | Which Account to search for in Keychain (example: `you@gmail.com`). Defaults to the `email` provided in `credentials`.
`service` | `string` | Which Service to search for in Keychain. Defaults to `'accounts.google.com'`.
`type` | `string` | What type of password to search for in Keychain. Defaults to `'internet'`.

You can populate your Keychain with a Google password like so:

```bash
security add-internet-password -a you@gmail.com -s accounts.google.com -w YOURPASSWORDHERE
```

# Development
Check out this repository:

```bash
git clone git@github.com:Birch-san/gmusicapi-node.git
```

## Experimenting
If you are have checked out this repository to develop it, probably you want to invoke its code.

You can make a "scratch" file (a.k.a. a "fiddle") within this repository to invoke functionality from within this repository.

### Saving fiddles into repository
The whole directory `scratch/` is `.gitignore`d, so feel free to add files there.

For example, you could make a file `scratch/scratch.js`:

```js
var gmusicapi = require('../src/js/index.js');

console.log(gmusicapi);
```

Alternatively: any file ending in `.scratch.js` is `.gitignore`d also, so you could save a fiddle file somewhere else if you prefer.

### Running your fiddles

You're using [Sublime Text](https://www.sublimetext.com/3), right? Add a new build system.

```json
{   
  "cmd": ["/usr/local/bin/node", "$file"],   
  "selector": "source.js"   
}
```

Now when you press `Cmd+B` upon a `.js` file, it will run your fiddle.