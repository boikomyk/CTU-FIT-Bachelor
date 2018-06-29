initialization
initialize 
	super initialize. 
	self width: 200.
	
self text: ((BrRopedText string: ('Options'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).