tests
testOpen
	|cell|
	cell := (MCellModel new) open.
	self assert: cell isOpened.