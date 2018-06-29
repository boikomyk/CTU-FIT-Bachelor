initialization
initializeWithHeight: h width: w
	self initialize.
	height := h.
	width := w.
	boardOfCells := Matrix rows: h columns: w.
	1 to: h do: [:x|  
		1 to: w do: [:y|
			boardOfCells at: x at: y put: MCellModel new.			
			 ]
		 ]