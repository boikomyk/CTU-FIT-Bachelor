actions
openCell: aCell
	aCell isOpened ifTrue: [ ^self ].
	"                               place mines abywhere except ↓                        "
	self isGameStart ifTrue: [self placeMines: aCell. self startTheGame ].
	aCell open.
	aCell minesAround = 0 ifTrue:[ (board neighbourhoodOfTheCell: aCell) do: [:neighbour|  self openCell: neighbour] .].
		((self markedCount + self openedCount = self cellsCount) & (numberOfMines = self markedCount)  ) ifTrue:[MGameStart isWin: true.].
	^self
	
	