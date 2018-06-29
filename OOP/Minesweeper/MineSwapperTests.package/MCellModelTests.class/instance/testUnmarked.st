tests
testUnmarked
	|cell|
	cell := (MCellModel new).
	cell unmark.
	self assert: cell unmarked.
	cell unmarkedSetFalse.
	self assert: cell unmarked not.