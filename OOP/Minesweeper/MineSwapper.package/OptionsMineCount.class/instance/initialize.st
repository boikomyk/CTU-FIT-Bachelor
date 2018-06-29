initialization
initialize
	super initialize.
	MGameMenu mines:( BrRopedText string: '   ').
	MGameMenu mines attributes: { BrFontSizeAttribute size:30 }.
	MGameMenu mines
	attributes:{
		BrTextForegroundAttribute paint:(
			BlLinearGradientPaint new
				stops: { 0 -> Color red. 1 -> Color blue };
				start: 0@0;
				end: 160@20) }
	from: 1 to: 3.
	self background: Color gray lighter.
	self size: 100@45;
	
	editor: (BrTextEditor new text: MGameMenu mines).