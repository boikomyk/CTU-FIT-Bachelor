tests-initialization
testInitialize
	|optionLine|
	optionLine := OptionsMineCount new.
	optionLine editor insertString: '1' at: 1.
	self assert: (MGameMenu mines  isKindOf: BrRopedText).
	self assert: ((MGameMenu mines asString asInteger) = 1).
	self assert: ((MGameMenu mines size) = 4).