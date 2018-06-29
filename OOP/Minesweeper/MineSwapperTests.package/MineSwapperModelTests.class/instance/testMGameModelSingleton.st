tests
testMGameModelSingleton
	|testGame1 testGame2|
	testGame1 := MGameModel  getUniqueInstance .
	testGame2 := MGameModel  getUniqueInstance.
	self assert: ((testGame1 = testGame2) = true)
