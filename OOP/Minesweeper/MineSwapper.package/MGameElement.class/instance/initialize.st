initialization
initialize
	super initialize.
	
	self layout: (BlGridLayout horizontal cellSpacing: 7).
	
	self fillGrid: MGameModel getUniqueInstance.

	self background: (BlBackground paint: Color black).
	
	self constraintsDo: [ :layoutConstraints |
		layoutConstraints horizontal fitContent.
		layoutConstraints vertical fitContent ]