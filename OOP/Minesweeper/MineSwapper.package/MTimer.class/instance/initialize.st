initialization
initialize 
	super initialize. 
	time_counter := 0.
	self width: 200.
	
self text: ((BrRopedText string: ((Time seconds: 0) print24))  attributes:
                    {(BrTextForegroundAttribute paint: (Color white alpha: 0.8)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).