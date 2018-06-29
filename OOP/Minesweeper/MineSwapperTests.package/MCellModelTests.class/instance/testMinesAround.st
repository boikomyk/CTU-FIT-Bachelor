tests
testMinesAround
	|cell|
	cell := (MCellModel new) minesAround: 6.
	self assert: cell minesAround equals: 6.
	cell minesAroundIncrement.
	self assert: cell minesAround equals: 7.