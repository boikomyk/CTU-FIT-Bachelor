opening
openInWindow: anElement

	|font|
	font:= BlElement new size: 480@510; background: Color black.
	space := BlSpace new
		extent: 480@510;
		title: 'Settings'.
	space root addChild: font; addChild: anElement; 
		yourself.
	space show