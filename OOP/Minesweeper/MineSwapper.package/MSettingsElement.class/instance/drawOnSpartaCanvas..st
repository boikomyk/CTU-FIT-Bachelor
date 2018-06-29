drawing
drawOnSpartaCanvas: aCanvas
	| bitmap |
	bitmap := aCanvas bitmap fromFileNamed: MGameUI getResourcesPath, 'menu.svg'.
	aCanvas fill
		paint: bitmap;
		path: self boundsInLocal;
		draw