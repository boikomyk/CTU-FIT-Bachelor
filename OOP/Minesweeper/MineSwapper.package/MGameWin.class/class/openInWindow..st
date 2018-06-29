instance creation
openInWindow: anElement
	|font|
	font:= BlElement new size: 300@150; background: Color black.

	space := BlSpace new
		extent: 300@150;
		title: 'Victory'.
	space root addChild: font; addChild: anElement;
		yourself.
	
	space show