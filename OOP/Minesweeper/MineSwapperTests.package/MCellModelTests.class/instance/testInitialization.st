tests
testInitialization
	|cell|
	cell := MCellModel new.
	self assert: cell mine not.
	self assert: cell marked not.
	self assert: cell isOpened not.
	self assert: cell minesAround = 0.