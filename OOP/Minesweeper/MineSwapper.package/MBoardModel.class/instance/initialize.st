initialization
initialize
	height := 10.
	width := 10.
	boardOfCells := Matrix rows: height columns: width.
	1 to: height do: [:x|  
		1 to: width do: [:y|
			boardOfCells at: x at: y put: MCellModel new.			
			 ]
		 ]
