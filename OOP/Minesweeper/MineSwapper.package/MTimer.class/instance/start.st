accessing
start 

	status := true. 
	
	[ [  self status ] whileTrue: [ 
						 self text: ((BrRopedText string: ((Time seconds: time_counter) print24))  attributes:
                    {(BrTextForegroundAttribute paint: (Color white alpha: 0.8)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}
        yourself ). 


	time_counter := time_counter + 1. 
	1 second wait. 
	]] fork.