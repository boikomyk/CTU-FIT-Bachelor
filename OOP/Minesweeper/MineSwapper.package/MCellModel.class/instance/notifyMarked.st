notifying
notifyMarked
	"Notify all observers that my marked state was changed (from unmarked to marked)"
  	self announcer announce: MCellMarkedAnnouncement new