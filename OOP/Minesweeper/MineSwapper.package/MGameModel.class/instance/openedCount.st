accessing
openedCount
	^ board boardOfCells count: [ :each | each isOpened ].
