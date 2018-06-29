initialization
initialize
	|eventListener levelButton|
	super initialize.
	arrayOfButtons := OrderedCollection new.
	self size: 500@500.
	self layout: (BlGridLayout horizontal cellSpacing: 200).
	self layout: (BlGridLayout vertical cellSpacing: 20).
	eventListener := self newMSettingsButtonEventListener.
	self background: (BlBackground paint: Color black).
	self layout columnCount: 2.
	self layout rowCount: 3.
	self fillArray.
	arrayOfButtons do: [ :button |
	 	levelButton := button.
		(levelButton isKindOf: MSumbitButton ) ifTrue: [levelButton addEventHandler: eventListener].
		self attachChild: levelButton.
	] 