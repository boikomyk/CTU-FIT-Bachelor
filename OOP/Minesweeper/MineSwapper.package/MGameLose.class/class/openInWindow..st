opening
openInWindow: anElement
	|font|
	font:= BlElement new size: 300@150; background: Color black.

	space := BlSpace new
		extent: 300@150;
		title: 'GameOver'.
	space root addChild: font; addChild: anElement;
		yourself.
	
	space show