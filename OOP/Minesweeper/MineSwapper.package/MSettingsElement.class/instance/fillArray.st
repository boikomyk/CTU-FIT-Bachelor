as yet unclassified
fillArray
	|first_line second_line|
	first_line:= BlTextElement new.
	second_line := BlTextElement new.
	
 	first_line text: ((BrRopedText string: ('Grid size:'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).

	second_line text: ((BrRopedText string: ('Mines count:'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).

		arrayOfButtons add: first_line; add: second_line; add: (MSumbitButton new); add: (OptionsGridSize new); add: (OptionsMineCount new).