initialization
initializeWithHeight: h width: w mines: m
	self initialize.
   board := MBoardModel withHeight: h width: w.
	gameState := 0.
	numberOfMines := m.		
