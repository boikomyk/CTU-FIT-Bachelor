as yet unclassified
neighbourhoodOfTheCell: cell
|neighbourhood addr|

addr := (boardOfCells indexOf: cell) value.

neighbourhood  := OrderedCollection new.
 
((addr x) - 1) to:((addr x) + 1) do: [:X|
	((addr y) - 1) to:((addr y) + 1) do:[:Y|
		[neighbourhood add: (boardOfCells at:X at:Y)] on: Error do:[].
			].
	  ].

	
^neighbourhood


