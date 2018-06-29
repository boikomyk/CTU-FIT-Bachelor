tests
testStartTheGame
	|game|
	game := MGameModel withHeight: 10 width: 10 mines: 10.
	game board boardOfCells atRandom.
	game openCell: (game board boardOfCells atRandom).
	self assert: game isGameStart not.
	self assert: game minesCount equals: 10.