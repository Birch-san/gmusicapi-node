import sys, json
from gmusicapi import Mobileclient

err = {
	'nature': 'error',
	'reason': 'EOF'
}

credentials = {}

for line in sys.stdin:
	# parsed = ast.literal_eval(line)
	parsed = json.loads(line)

	if 'action' not in parsed:
		err['reason'] = 'malformed input'
		break

	action = parsed['action']

	if action == 'credentials':
		credentials['email'] = parsed['email']
		credentials['password'] = parsed['password']

		# try:
		print json.dumps({
			# 'action': str(type(action)),
			'action': 'credentials',
			'nature': 'ACK'#,
			# 'action': sane.encode('utf8')
			})
		# except Exception as e:
		# 	print json.dumps('yo')

		continue

	# if action == 'act':
	# 	api = Mobileclient()
	# 	login = api.login(credentials['email'], credentials['password'], Mobileclient.FROM_MAC_ADDRESS)

	# 	print json.dumps({
	# 		'nature': 'ACK',
	# 		'action': action,
	# 		'detail': login
	# 		})
	# 	continue

print json.dumps(err)