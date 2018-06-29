tests
testMCellModelisOpened
	|testCell|
	testCell := MCellModel new.
	self assert: testCell isOpened = false.
	testCell open.
	self assert: testCell isOpened =true.
