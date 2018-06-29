initialization
initialize 
	super initialize. 
	self width: 200.
	
self text: ((BrRopedText string: ('Exit Game'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}).