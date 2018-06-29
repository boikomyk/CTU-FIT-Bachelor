tests
testMarkCell
	|game cell|
	game := MGameModel withHeight: 10 width: 10 mines: 10.
	game board boardOfCells atRandom.
	cell := game board boardOfCells atRandom.
	game markCell: cell.
	self assert: cell marked.
	game unmarkCell: cell.
	self assert: cell marked not.