initialization
initialize 
	super initialize. 
	self width: 80.
	self background: Color gray darker.
	
self text: ((BrRopedText string: (' OK '))  attributes:
                    {(BrTextForegroundAttribute paint: (Color red alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 100).
                    (BrFontGenericFamilyAttribute monospace).}).