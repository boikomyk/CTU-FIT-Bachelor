tests
testCustomInitialization
	|board|
	board := MBoardModel withHeight: 20 width: 20.
	self assert: board cellsCount equals: 400.
	board boardOfCells do: [:each| self assert: each notNil ].
	self assert: board height equals: 20.
	self assert: board width equals: 20.
	