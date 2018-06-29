printing
printOn: aStream
	
	1 to: height do:[:x|
		1 to: width do:[:y|
			(boardOfCells at:x at:y) printOn: aStream.  
			aStream  nextPut: Character space.
			].
		aStream cr. 
		]

	
