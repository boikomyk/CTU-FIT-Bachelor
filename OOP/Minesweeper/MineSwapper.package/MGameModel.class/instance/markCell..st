actions
markCell: aCell
	aCell isOpened ifTrue: [ ^self ].
	
	"aCell marked ifTrue: [ Transcript show: 'gotIn '.aCell unmark. ^self ]." "always pass if and get in"

	aCell mark.	
	
	((self markedCount + self openedCount = self cellsCount )& (numberOfMines = self markedCount ) ) ifTrue:[MGameStart isWin: true.]
	"(self minesLeftCount = 0 and: (self minesCount = self markedCount)) ifTrue: [ self notifyWin . ]."