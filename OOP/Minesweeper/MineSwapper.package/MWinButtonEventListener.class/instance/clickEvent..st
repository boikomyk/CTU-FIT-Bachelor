mouse handlers
clickEvent: anEvent
	 (anEvent target isKindOf: MWinButton) ifTrue: 
	[
	 	MGameStart isWin: false.
		MGameMenu open.
		MGameStart close.
		MGameWin close.	
	 ]
	