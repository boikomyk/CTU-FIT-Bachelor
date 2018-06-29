actions
placeMines: notMineCell
"                ↑                   "
"                ------------------- "
"                                  | "
"place mines anywhere except this boy"

	|availableCells  cell notMineCellsNeighbours|
	
	notMineCellsNeighbours := board neighbourhoodOfTheCell: notMineCell.
	
	availableCells := ((board boardOfCells asArray) reject: [:x |  notMineCellsNeighbours includes: x ]) asOrderedCollection.
	
   numberOfMines timesRepeat: [
	      cell := availableCells atRandom.
		   cell mine: true.
		   availableCells remove: cell ifAbsent: [  ].
		].
	
	
	self setMinesAround.

	