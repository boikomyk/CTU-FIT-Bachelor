tests
testUnmark
	|cell|
	cell := (MCellModel new) mark; unmark.
	self assert: cell marked not.