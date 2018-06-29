tests
testSetBoardOfCells
	|board|
	board := MBoardModel new.
	board boardOfCells: 10.
	self assert: board boardOfCells equals: 10.