accessing
size
	|gridSize|
	gridSize := (MGameMenu size asString asInteger).
	(gridSize isKindOf: UndefinedObject) ifTrue: [ ^480 ].
	"Default grid 10X10"
	(gridSize isKindOf: UndefinedObject) ifFalse: [ ^(48*gridSize) ].
	