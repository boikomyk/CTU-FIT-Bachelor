as yet unclassified
fillArray
	|firstElement|
	firstElement := BlTextElement new.
	
 	firstElement text: ((BrRopedText string: ('You lose :)'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).
		arrayOfButtons add: firstElement; add: (MLoseButton new).