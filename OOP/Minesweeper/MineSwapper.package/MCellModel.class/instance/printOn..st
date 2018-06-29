printing
printOn: aStream
		
		(opened)
			ifTrue: [ mine ifTrue:[aStream nextPutAll: '*' ]
									ifFalse:[ (self minesAround = 0) ifTrue: [ aStream nextPutAll: '□' ]  
										ifFalse:[self minesAround printOn: aStream]]]
      		ifFalse: [ aStream nextPutAll: '■'].
