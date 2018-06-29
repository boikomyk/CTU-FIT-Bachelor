as yet unclassified
drawPathOnSpartaCanvas: aCanvas
	super drawPathOnSpartaCanvas: aCanvas.
	self drawCommonOnCanvas: aCanvas.

	self cell isOpened
		ifTrue: [ self drawFlippedOnCanvas: aCanvas ]
		ifFalse: [ self drawBacksideOn: aCanvas ]