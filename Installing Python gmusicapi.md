## Python
I assume (moreorless arbitrarily) that `gmusicapi` depends on Python 2.7. At the time of writing, [I see that Python 3 is not supported](https://github.com/simon-weber/gmusicapi/pull/312).

I enforce that Major version must `== 2`, and Minor version must `>= 7`. You may have other Python executables available. For now I perform my version check upon whichever Python the NodeJS [`python-shell`](https://github.com/extrabacon/python-shell) chooses.

### Confirm `python` version
Is the `python` on your PATH the one you are thinking of?

```bash
python -V
```

Expected output is something like:

```
Python 2.7.8
```

## `gmusicapi` Python module
[`gmusicapi` recommends](https://unofficial-google-music-api.readthedocs.org/en/latest/usage.html#usage) installing itself via [`pip`](https://pip.pypa.io/en/latest/), which is a Python package manager.

You would use `pip` to acquire the `gmusicapi` Python module.

### Install `pip`
Instructions [here](https://pip.pypa.io/en/latest/installing/)

#### Confirm `pip` version
Does the `pip` on your PATH concern the correct version of Python?

```bash
pip -V
```

Expected output will look something like:

```
pip 7.1.2 from /usr/local/lib/python2.7/site-packages (python 2.7)
```

Note `python 2.7`, as required.

### Install `gmusicapi`
Instructions [here](https://unofficial-google-music-api.readthedocs.org/en/latest/usage.html#usage), but essentially:

```bash
pip install gmusicapi
```

In particular, you are looking for these lines:

```
Installing collected packages: gmusicapi
  Running setup.py install for gmusicapi
Successfully installed gmusicapi-7.0.0
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

Note the `Location: /usr/local/lib/python2.7/site-packages`; this is where your package is installed.

Look inside that `Location`.

You should have a `gmusicapi` folder and an `.egg-info` folder:

```
/usr/local/lib/python2.7/site-packages/gmusicapi
/usr/local/lib/python2.7/site-packages/gmusicapi-7.0.0-py2.7.egg-info
```

If you have no `gmusicapi` folder, then setup did not run upon this egg. Uninstalling and reinstalling `gmusicapi` may help.

#### Second pass
Check whether you are capable now of importing gmusicapi

```bash
python -c "from gmusicapi import Mobileclient"
```

If the output is empty: great!

If it blows up: you've got a problem. Fix that before continuing to use this Node library.

For example, if you get:

```
Traceback (most recent call last):
  File "<string>", line 1, in <module>
ImportError: No module named gmusicapi
```

Then the `gmusicapi` module was not installed under any of the module search paths which your Python environment inspects.

##### Well, which search paths is Python inspecting?
###### Mac (or any BSD system)
You can watch which file handles are being opened by the kernel.

Get this running in a Terminal window whilst your failing "import" script runs:

```bash
sudo opensnoop | grep gmusicapi
```

You'll see the directories in which Python tries (and fails with `-1`) to search for your module.

Or you'll see a huge stream of errors because you're on El Capitan. Fix [like so](http://apple.stackexchange.com/a/208763) (requires recovery reboot).

###### Windows
Same as above, but use [Windows Sysinternals' `ProcMon`](https://technet.microsoft.com/en-us/sysinternals/processmonitor.aspx), and filter to Paths which contain `gmusicapi`.

##### How do I make it search in more places?
Recall from when you ran:

```bash
pip show gmusicapi
```

You identified where the `gmusicapi` module was installed (i.e. the `Location` that was dumped). You need to add that to your `PYTHONPATH`.

Ensure that this environment variable is set whenever a login shell launches (i.e. add to your `~/.bash_profile`):
```bash
export PYTHONPATH="$PYTHONPATH:/usr/local/lib/python2.7/site-packages"
```

To recruit these changes during the current `bash` session, source your profile:

`source ~/.bash_profile`