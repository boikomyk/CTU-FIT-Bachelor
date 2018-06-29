accessing
mine: isMine
	"Initialize the cell as a mine or as a simple cell"
	self
		assert: [ isMine isNotNil ]
		description: [ 'isMine must not be nil' ].

	mine := isMine