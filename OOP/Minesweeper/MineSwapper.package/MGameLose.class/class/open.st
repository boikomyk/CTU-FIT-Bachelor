instance creation
open
	<script: 'self open'>

	(MGameStart isLosed = true ) ifTrue:[ 
		MGameStart isLosed: false. 
		self openInWindow: (MLoseElement  new).
		 ].