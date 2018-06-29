as yet unclassified
getResourcesPath
	| rep |
	rep := self getIceRepository.
	rep = nil
		ifTrue: [ ^ '/Icons.package/' ].
	^ (rep location )pathString , '/Icons.package/'
