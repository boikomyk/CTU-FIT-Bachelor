tests
testCustomInitialization
	|game|
	game := MGameModel withHeight: 10 width: 10 mines: 0 .
	self assert: game cellsCount equals: 100.
	self assert: game isGameStart.
	self assert: game minesCount equals: 0.
	self assert: game announcer notNil.