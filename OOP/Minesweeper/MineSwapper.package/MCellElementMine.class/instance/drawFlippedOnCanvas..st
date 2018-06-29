initialization
drawFlippedOnCanvas: aCanvas
	self size: 32 @ 32.
  	aCanvas drawImage: image at: self position
