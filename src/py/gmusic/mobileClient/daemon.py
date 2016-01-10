import sys, json, time

class Daemon():
	def __init__(self):
		self.rememberThis = 0

	def setGmusic(self, gmusic):
		self.rememberThis += 1

	def getGmusic(self):
		return self.rememberThis

myDaemon = Daemon()

ended = False

def is_json(myjson):
    try:
        json_object = json.loads(myjson)
    except ValueError, e:
        return False
    return True

def makeError(action, reason):
	ended = True
	return {
		'action': action,
		'reason': reason
	}

def handleOpen(obj, myDaemon):
	response = {
		'action': 'open'
	};

	email = obj['email'];
	password = obj['password'];
	if ('email' in obj):
		myDaemon.setGmusic(None)
		response['outcome'] = 'success'
		response['whatever'] = myDaemon.getGmusic()
		return response;

	return makeError("Unrecognised 'open' form.")

def handleAction(obj, myDaemon):
	if 'action' not in obj:
		return makeError('error', "Unsupported input; expected 'action' key.")
	
	action = obj['action']
	if action == 'open':
		return handleOpen(obj, myDaemon)

	return makeError(action, "Unrecognised action: {0}".format(action))

def handleLine(line, myDaemon):
	if not is_json(line):
		return makeError('error', 'Malformed input could not be parsed as JSON: {0}'.format(line))

	parsed = json.loads(line)

	if type (parsed) != type({}):
		return makeError('error', 'Malformed input: expected JSON object; received JSON primitive instead: {0}'.format(parsed))
		
	return handleAction(parsed, myDaemon)

# simple JSON echo script
while not ended:
	line = sys.stdin.readline()
	if not line:
		break
# for line in sys.stdin:

	response = handleLine(line, myDaemon)

	print json.dumps(response)
	sys.stdout.flush()