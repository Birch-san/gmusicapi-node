import os, json

result = {}

try:
    import gmusicapi
    result['outcome'] = 'success'
except ImportError:
	result['outcome'] = 'failure'

	lookuppaths = []
	try:
	    lookuppaths = os.environ['PYTHONPATH'].split(os.pathsep)
	except KeyError:
		pass
	result['lookuppaths'] = lookuppaths

print json.dumps(result)