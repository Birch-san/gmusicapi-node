import sys, json
from gmusicapi import Mobileclient

for line in sys.stdin:
	parsed = json.loads(line)

	if 'action' not in parsed:
		err['reason'] = 'malformed input'
		break

	action = parsed['action']

	if action == 'getPlaylists':
		api = Mobileclient()
		# login = api.login(parsed['email'], parsed['password'], Mobileclient.FROM_MAC_ADDRESS)
		login = False

		if not login:
			print json.dumps({
				'outcome': 'failure',
				'reason': 'login',
				'detail': json.dumps(login)
				})
			break

		print json.dumps({
			'outcome': 'success',
			'detail': json.dumps(login)
			})

		break