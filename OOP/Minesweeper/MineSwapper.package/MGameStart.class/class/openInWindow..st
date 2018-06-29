opening
openInWindow: anElement

	| length |
	timerON := false.
	length:= (self size).
	(length < 180) ifTrue: [ length:= 180 ].
	font:= BlElement new size: (length)@(self size + 30); background: Color black.
	timer:= MTimer new.
	counter:=MMinesLeftCounter new.
	counter getEl: anElement.
	space  := BlSpace new
		extent: (length)@(self size + 30);
		title: 'MineSweeper'.
	space root addChild: font; addChild: anElement; addChild: timer; addChild: (counter relocate: (length - 55)@0);
		yourself.
	
	space show