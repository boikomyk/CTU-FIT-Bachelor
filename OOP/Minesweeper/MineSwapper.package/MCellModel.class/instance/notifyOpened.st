notifying
notifyOpened
	"Notify all observers that my opened state was changed (from opened to not)"
  	self announcer announce: MCellOpenedAnnouncement new