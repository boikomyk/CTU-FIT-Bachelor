mouse handlers
scrollEvent: anEvent

        [self mineSwapper markCell: (anEvent target cell)] on: MessageNotUnderstood do: [  ].
		  (MGameStart timerON = false) ifTrue: [
			 MGameStart timer start.
		  	 MGameStart timerON:true.
			].

