mouse handlers
clickEvent: anEvent
	|minesCount gridSize|
	(anEvent target isKindOf: MContinueButton ) ifTrue:[ "Continue Game"
	MGameStart open.
	MGameMenu space close.
	].
	(anEvent target isKindOf: MStartButton ) ifTrue:[    "New Game"
	MGameStart isLosed: false.
	gridSize := (MGameMenu size asString asInteger).
	minesCount := (MGameMenu mines asString asInteger).
	(gridSize isKindOf: UndefinedObject) ifTrue: [ MGameModel withHeight: 10 width: 10 mines: 20. ].
	(gridSize isKindOf: UndefinedObject) ifFalse: [ MGameModel withHeight: gridSize width: gridSize mines: minesCount. ].
	MGameStart open.
	MGameMenu space close.
	
	].
	(anEvent target isKindOf: MExitButton) ifTrue: 
	[ 
	MGameMenu space close.
	].
	(anEvent target isKindOf: MOptionsButton ) ifTrue: 
	[  
	MGameSettings open.
	MGameMenu space close.
	] 
	
	