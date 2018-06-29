tests-initialization
testInitialize
	|optionLine|
	optionLine := OptionsGridSize new.
	optionLine editor insertString: '1' at: 1.
	optionLine editor insertString: '2' at: 2.
	self assert: (MGameMenu size isKindOf: BrRopedText).
	self assert: ((MGameMenu size asString asInteger) =  12 ) .
	self assert: ((MGameMenu size size) = 5).