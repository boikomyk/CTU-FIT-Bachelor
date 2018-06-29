accessing
drawOnSpartaCanvas: aCanvas
	|font|
	 font := aCanvas font
	 named: 'Source Sans Pro';
    size: 26;
    build.
	self size: 50 @ 30.
 aCanvas text
    baseline: (10@24);
    font: font;
    paint: Color white;
    string: self count asString;
    draw.       
  
	^self.