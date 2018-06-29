accessing
startTheGame
	self isGameStart ifTrue: [ gameState := 1 ].
	^self