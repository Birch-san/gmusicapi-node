# Purpose
This Node library should enable you to invoke from Node the functionality of Simon Weber's [Unofficial Google Music API, `gmusicapi`](https://github.com/simon-weber/gmusicapi).

It is _not_ a re-implementation; it binds to existing functionality from the Python module.

The main reason for using this Node module is to stubbornly avoid learning Python.

# Requirements
## Python
I assume (moreorless arbitrarily) that `gmusicapi` depends on Python 2.7. At the time of writing, [I see that Python 3 is not supported](https://github.com/simon-weber/gmusicapi/pull/312).

I enforce that Major version must `== 2`, and Minor version must `>= 7`. You may have other Python executables available. For now I perform my version check upon whichever one the NodeJS [`python-shell`](https://github.com/extrabacon/python-shell) chooses.

## Pip
[`gmusicapi` recommends](https://unofficial-google-music-api.readthedocs.org/en/latest/usage.html#usage) installing itself via [`pip`](https://pip.pypa.io/en/latest/), which is a Python package manager.

You would use `pip` to acquire the `gmusicapi` Python module.

### Install `pip`
Instructions [here](https://pip.pypa.io/en/latest/installing/)

### Install `gmusicapi`
Instructions [here](https://unofficial-google-music-api.readthedocs.org/en/latest/usage.html#usage), but essentially:

```bash
pip install gmusicapi
```

#### Extras
If you intend to use the "upload music" APIs, you will need a way to transcode audio. For example `ffmpeg` or similar. Ensure that whatever you install for this purpose, is exposed on your PATH.

You will want at least `libmp3lame` installed for use by your audio transcoder.

### Sanity check
#### First pass
Wondering if `pip` has successfully installed `gmusicapi`? Ask it to show you what it installed:

```bash
pip show gmusicapi
```

Hopefully the reply looks something like this:

```bash
---
Metadata-Version: 1.1
Name: gmusicapi
Version: 7.0.0
Summary: An unofficial api for Google Play Music.
Home-page: http://pypi.python.org/pypi/gmusicapi/
Author: Simon Weber
Author-email: simon@simonmweber.com
License: Copyright (c) 2015, Simon Weber
Location: /usr/local/lib/python2.7/site-packages
```

#### Second pass
Make a python file and attempt to recruit functionality from `gmusicapi`:

```python
from gmusicapi import Mobileclient

api = Mobileclient()

print api
```

If it blows up, then you've got a problem. 
Fix that before continuing to use this Node library.

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
The `gmusicapi` you `require()`d will expose to you some useful functions. Err, one day.

```js
var gmusicapi = require('gmusicapi-node');

console.log(gmusicapi);
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