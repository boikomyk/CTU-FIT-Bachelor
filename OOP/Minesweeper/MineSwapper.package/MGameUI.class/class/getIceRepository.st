as yet unclassified
getIceRepository
	IceRepository registry
		detect: [ :each | 
			each name = 'OOP'
				ifTrue: [ ^ each ] ].
			^nil.
