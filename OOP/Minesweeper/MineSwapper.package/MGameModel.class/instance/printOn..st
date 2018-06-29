printing
printOn: aStream
	board printOn: aStream.
	aStream cr;
	nextPutAll: 'MinesLeft='.
	(self minesCount - self markedCount) printOn: aStream.
	
