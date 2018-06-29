mouse handlers
clickEvent: anEvent
	 (anEvent target isKindOf: MLoseButton) ifTrue: 
	[
	 	MGameStart isLosed: false.
		MGameMenu open.
		MGameStart close.
		MGameLose close.
		"MGameMenu open."
		
	 ]
	