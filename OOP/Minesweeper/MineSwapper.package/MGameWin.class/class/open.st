instance creation
open
	<script: 'self open'>

	(MGameStart isWin = true ) ifTrue:[ 
		MGameStart isWin: false. 
		self openInWindow: (MWinElement  new).
		 ].
	
	      "MGameStart isWin: false. 
		self openInWindow: (MWinElement  new)."