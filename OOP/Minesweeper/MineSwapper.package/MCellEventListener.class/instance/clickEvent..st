mouse handlers
clickEvent: anEvent
        [self mineSwapper openCell: (anEvent target cell)] on: MessageNotUnderstood do: [  ].
		  (MGameStart timerON = false) ifTrue: [
			 MGameStart timer start.
		  	 MGameStart timerON:true.
			].
		  
		  
			