actions
open
  	"Open the cell (toggle opened state)"
	marked ifTrue: [ ^self ].
  	opened := true.
	mine ifTrue: [ self notifyBombed. ].
  	self notifyOpened
