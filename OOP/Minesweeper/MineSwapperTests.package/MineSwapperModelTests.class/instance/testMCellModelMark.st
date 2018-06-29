tests
testMCellModelMark
	| testCell|
	testCell := MCellModel new.
	self assert: testCell marked = false.
	testCell mark.
	self assert: testCell marked = true.
