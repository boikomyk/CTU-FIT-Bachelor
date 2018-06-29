initialization
setMinesAround
	|arrayOfNeighbourCells|


	board boardOfCells do: [:cell |
		arrayOfNeighbourCells := board neighbourhoodOfTheCell: cell.
		cell minesAround: (arrayOfNeighbourCells count: [ :each | each mine ]).
	].
	
	^self
