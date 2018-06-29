initialization
initialize
	super initialize.
	MGameMenu size: (BrRopedText string: '   ').
	MGameMenu size attributes: { BrFontSizeAttribute size:30 }.
	MGameMenu size
	attributes:{
		BrTextForegroundAttribute paint:(
			BlLinearGradientPaint new
				stops: { 0 -> Color red. 1 -> Color blue };
				start: 0@0;
				end: 150@20) }
	from: 1 to: 3.
	self background: Color gray lighter.
	self size: 100@45;
	
	editor: (BrTextEditor new text: MGameMenu size).