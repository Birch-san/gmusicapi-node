import sys, json
# from gmusicapi import Mobileclient

# api = Mobileclient()
# api.login('user@gmail.com', 'my-password', Mobileclient.FROM_MAC_ADDRESS)

for line in sys.stdin:
  print json.dumps(json.loads(line))