as yet unclassified
getUniqueInstance
	^ uniqueInstance ifNil: [ uniqueInstance := self withHeight: 10 width: 10 mines: 20 ]
