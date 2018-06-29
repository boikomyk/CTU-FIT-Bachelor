tests
testDefaultInitialization
	|board cell|
	board := MBoardModel new.
	cell := board boardOfCells atRandom.
	self assert: (board neighbourhoodOfTheCell: cell) isNotEmpty .
	
	