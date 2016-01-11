def handleOpen(obj, myDaemon, action):
	email = obj['email'];
	password = obj['password'];
	if ('email' in obj):
		return myDaemon.connect(action, obj)

	return myDaemon.makeError(action, "Unrecognised 'open' form.")

def handleAction(obj, myDaemon):
	if 'action' not in obj:
		return myDaemon.makeError('error', "Unsupported input; expected 'action' key.")
	
	action = obj['action']
	if action == 'open':
		return handleOpen(obj, myDaemon, action)

	if action == 'getPlaylists':
		return handleGetPlaylists(obj, myDaemon, action)

	return myDaemon.makeError(action, "Unrecognised action: {0}".format(action))

def handleGetPlaylists(obj, myDaemon, action):
	# return myDaemon.makeError('getPlaylists', 'Not implemented')
	api = myDaemon.getClient()
	results = api.get_all_playlists()

	return {
		'action': action,
		'outcome': 'success',
		'payload': results
	}