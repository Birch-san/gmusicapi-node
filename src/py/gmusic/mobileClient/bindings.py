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

	return myDaemon.makeError('open', "Unrecognised 'open' form.")

def handleAction(obj, myDaemon):
	if 'action' not in obj:
		return myDaemon.makeError('error', "Unsupported input; expected 'action' key.")
	
	action = obj['action']
	if action == 'open':
		return handleOpen(obj, myDaemon)

	if action == 'getPlaylists':
		return handleGetPlaylists(obj, myDaemon)

	return myDaemon.makeError(action, "Unrecognised action: {0}".format(action))

def handleGetPlaylists(obj, myDaemon):
	return myDaemon.makeError('getPlaylists', 'Not implemented')