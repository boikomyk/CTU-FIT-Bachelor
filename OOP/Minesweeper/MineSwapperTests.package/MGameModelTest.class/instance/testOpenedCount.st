tests
testOpenedCount
	|game|
	game := MGameModel withHeight: 10 width: 10 mines: 0 .
	self assert: game openedCount equals: 0.