as yet unclassified
fillGrid: aMModel
		  mineSwapper  := aMModel.
        self layout columnCount: aMModel board width.
		  self layout rowCount: aMModel board height.
        mineSwapper board boardOfCells asArray 
        do: [ :aMCell |	 self addChild: ((MCellElement new) cell: aMCell);
				   addEventHandler: (self newCellEventListener
               mineSwapper: aMModel). 
			    ].
