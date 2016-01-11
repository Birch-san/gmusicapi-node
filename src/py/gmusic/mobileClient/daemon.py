if __name__ == '__main__':
    if __package__ is None:
        import sys
        from os import path
        sys.path.append( path.dirname( path.dirname( path.abspath(__file__) ) ) )
        from mobileClient import bindings, state
    else:
        from . import bindings, state

import sys, json, time

myDaemon = state.Daemon()

def is_json(myjson):
    try:
        json_object = json.loads(myjson)
    except ValueError, e:
        return False
    return True

def handleLine(line, myDaemon):
	if not is_json(line):
		return myDaemon.makeError('error', 'Malformed input could not be parsed as JSON: {0}'.format(line))

	parsed = json.loads(line)

	if type (parsed) != type({}):
		return myDaemon.makeError('error', 'Malformed input: expected JSON object; received JSON primitive instead: {0}'.format(parsed))
		
	return bindings.handleAction(parsed, myDaemon)

# simple JSON echo script
while not myDaemon.ended:
	line = sys.stdin.readline()
	if not line:
		break
# for line in sys.stdin:

	response = handleLine(line, myDaemon)

	print json.dumps(response)
	sys.stdout.flush()