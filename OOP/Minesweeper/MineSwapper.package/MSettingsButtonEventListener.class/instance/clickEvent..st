mouse handlers
clickEvent: anEvent
	 (anEvent target isKindOf: MSumbitButton) ifTrue: 
	[
	 	MGameMenu open.
		MGameSettings close.
	 ]
	