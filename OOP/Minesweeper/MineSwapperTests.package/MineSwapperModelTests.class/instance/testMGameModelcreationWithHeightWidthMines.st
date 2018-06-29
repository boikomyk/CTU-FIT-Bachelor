tests
testMGameModelcreationWithHeightWidthMines
	| testGame |
	testGame := MGameModel withHeight: 10 width: 10 mines: 20.
	self assert:( testGame numberOfMines) = 20. 
	self assert: (testGame  cellsCount) = 100. 
	self assert: (testGame board  height)  = 10.  
	self assert: (testGame board  width) = 10.  