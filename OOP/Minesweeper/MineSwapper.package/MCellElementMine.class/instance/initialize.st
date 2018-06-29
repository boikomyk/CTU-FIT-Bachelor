initialization
initialize
	|repo imageToPush|
	super initialize. 
	repo := IceRepository registry detect: [ :each | each name = 'OOP' ].
	image := repo location / 'Icons.package' / 'mine.svg'.
	imageToPush := ImageReadWriter 
	formFromFileNamed: '/home/grankdan/FIT/OOP/Icons.package/mine.jpg'.
	self relocate: 15@15;
	geometry: (BlRectangle cornerRadius: 4);
	background: 
	(
	
		BlBackground builder 
		image: imageToPush;
		"paint: Color gray;"
		opacity: 1;
		build
	)
