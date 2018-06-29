initialization
initialize
	|eventListener levelButton|
	super initialize.
	arrayOfButtons := OrderedCollection new.
	self size: 500@500.
	self layout: (BlGridLayout horizontal cellSpacing: 200).
	self layout: (BlGridLayout vertical cellSpacing: 70).
	eventListener := self newMMenuButtonEventListener.
	self background: (BlBackground paint: Color black).
	self layout columnCount: 1.
	self layout rowCount: 4.
   self fillArray.
	arrayOfButtons do: [ :button |
	 	levelButton := button.
		levelButton addEventHandler: eventListener.
		self attachChild: levelButton.
	] 
