initialization
initialize
	|eventListener levelButton|
	super initialize.
	arrayOfButtons := OrderedCollection new.
	self size: 500@500.
	self layout: (BlGridLayout horizontal cellSpacing: 70).
	self layout: (BlGridLayout vertical cellSpacing: 30).
	eventListener := MLoseButtonEventListener new.
	self background: (BlBackground paint: Color black).
	self layout columnCount: 1.
	self layout rowCount: 2.
   self fillArray.
	arrayOfButtons do: [ :button |
	 	levelButton := button.
		(levelButton isKindOf: MLoseButton) ifTrue: [levelButton addEventHandler: eventListener].
		self attachChild: levelButton.
	] 