class Daemon():
	def __init__(self):
		self.rememberThis = 0
		self.ended = False

	def setGmusic(self, gmusic):
		self.rememberThis += 1

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