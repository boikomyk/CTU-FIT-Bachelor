as yet unclassified
teststart
	|timer second|
	timer:= MTimer new.
   timer start. 
   1 seconds wait.
   timer stop.
	second := (timer text asString copyFrom: (timer text size - 1) to: (timer text size)) asInteger.
   self assert: second < 3.