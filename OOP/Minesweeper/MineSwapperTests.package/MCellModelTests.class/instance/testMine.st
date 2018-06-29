tests
testMine
	|cell|
	cell := (MCellModel new) mine: true.
	self assert: cell mine.