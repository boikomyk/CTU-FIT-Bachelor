initialization
initialize 
	super initialize. 
	self width: 200.
	
self text: ((BrRopedText string: ('Continue'))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 100).
                    (BrFontGenericFamilyAttribute monospace).}).