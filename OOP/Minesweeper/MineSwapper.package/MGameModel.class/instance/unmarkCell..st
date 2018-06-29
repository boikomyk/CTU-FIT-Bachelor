actions
unmarkCell: aCell
	aCell marked ifFalse: [ ^self ].
	"                               place mines abywhere except ↓                        "
	
	aCell unmark.
	^self