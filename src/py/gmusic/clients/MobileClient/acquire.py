import sys, json, pickle
from gmusicapi import Mobileclient

for line in sys.stdin:
	parsed = json.loads(line)

	if 'action' not in parsed:
		err['reason'] = 'malformed input'
		break

	action = parsed['action']

	if action == 'acquire':
		api = Mobileclient()
		login = api.login(parsed['email'], parsed['password'], Mobileclient.FROM_MAC_ADDRESS)

		if not login:
			print json.dumps({
				'outcome': 'failure',
				'reason': 'login',
				'detail': json.dumps(login)
				})
			break

		pickled = pickle.dumps(api)

		print json.dumps({
			'outcome': 'success',
			'detail': json.dumps(pickled)
			})

		break