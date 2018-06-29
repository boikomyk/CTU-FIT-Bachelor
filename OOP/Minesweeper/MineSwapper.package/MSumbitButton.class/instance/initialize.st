initialization
initialize 
	super initialize. 
	self width: 200.
	self background: Color gray lighter.
	
self text: ((BrRopedText string: (' Sumbit '))  attributes:
                    {(BrTextForegroundAttribute paint: (Color black alpha: 1.0)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 100).
                    (BrFontGenericFamilyAttribute monospace).}).