tests
testMark
	|cell|
	cell := (MCellModel new) mark.
	self assert: cell marked.