drawing
drawOnSpartaCanvas: aCanvas
	self mineImage: 'mine.svg' canvas: aCanvas.	"initialize bomb icon"
	self flagImage: 'flag.svg' canvas: aCanvas.	"initialize flag icon"
	(MGameStart isLosed = true) ifFalse: [ 
	
		self cell mine & self cell isOpened
		ifTrue: [ | font |
			font := aCanvas font
				named: 'Source Sans Pro';
				size: 26;
				build.
			self size: 40 @ 40.
			aCanvas fill
				path: self boundsInLocal;
				path: (aCanvas shape roundedRectangle: self boundsInLocal radii: (BlCornerRadii radius: 3));
				paint: self mineImage;
				draw.
			MGameStart timer stop.	"Stop timer if opened cell contained mine"
			MGameStart isLosed: true.
			^ self ].
	self cell isOpened not & self cell marked
		ifTrue: [ | font |
			font := aCanvas font
				named: 'Source Sans Pro';
				size: 26;
				build.
			self size: 40 @ 40.
			aCanvas fill
				paint: self flagImage;
				path: self boundsInLocal;
				draw.
				(MGameStart isWin = true) ifTrue:[ MGameStart timer stop. MGameWin open.].
			^ self ].
		
	self cell unmarked
		ifTrue: [ 
			Transcript show: 'drawOnSpartaCanvas'.
			self cell unmarkedSetFalse.
			self drawBacksideOn: aCanvas.
			^ self ].
		
	self cell isOpened
		ifTrue: [ self drawFlippedOnCanvas: aCanvas ]
		ifFalse: [ self drawBacksideOn: aCanvas ]
		].
	(MGameStart isWin = true) ifTrue:[ MGameStart timer stop. MGameWin open.].
	(MGameStart isLosed = true) ifTrue: [  0.5 seconds wait. MGameLose open. MGameStart isLosed: false.].