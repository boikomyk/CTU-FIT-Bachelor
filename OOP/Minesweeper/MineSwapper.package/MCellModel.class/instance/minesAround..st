accessing
minesAround: aNumber
	"Initialize the cell with a given number as a number of mines around the cell"
	self
		assert: [ aNumber isNotNil ]
		description: [ 'Number of mines around the cell must not be nil' ].
		
		self
		assert: [ aNumber <= 9 & aNumber >= 0 ]
		description: [ 'Number of mines should be between 0 and 9' ].

	minesAround  := aNumber