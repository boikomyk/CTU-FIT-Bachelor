tests
testMGameModelIsGameStart
	|testGame|
	testGame := MGameModel  withHeight: 10 width: 10 mines: 20 .
	self assert: testGame isGameStart = true.
