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