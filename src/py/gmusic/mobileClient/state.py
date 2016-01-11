import json
from gmusicapi import Mobileclient

class Daemon():
	def __init__(self):
		self.api = None
		self.login = None
		self.ended = False

	def connect(self, action, credentials):
		self.api = Mobileclient()
		self.login = self.api.login(credentials['email'], credentials['password'], Mobileclient.FROM_MAC_ADDRESS)

		if not self.login:
			return {
				'action': action,
				'outcome': 'failure',
				'reason': 'login',
				'detail': json.dumps(self.login)
				}

		return {
			'action': action,
			'outcome': 'success',
			'detail': json.dumps(self.login)
			}

	def getGmusic(self):
		return self.rememberThis

	def makeError(self, action, reason):
		self.ended = True
		return Daemon.makeError(action, reason)

	@staticmethod
	def makeError(action, reason):
		return {
			'action': action,
			'outcome': 'error',
			'reason': reason
		}