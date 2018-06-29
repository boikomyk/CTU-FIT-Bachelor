initialization
drawFlippedOnCanvas: aCanvas
| font |
  font := aCanvas font
    named: 'Source Sans Pro';
    size: 26;
    build.
	self size: 40 @ 40.
(self cell minesAround isZero) ifTrue:
[ 	
        aCanvas fill
          paint: Color green;
          path: (aCanvas shape roundedRectangle: self boundsInLocal radii:
           (BlCornerRadii radius: 3));
          draw.
 ].

(self cell minesAround isZero) ifFalse: 
[ 
aCanvas fill
   paint: Color yellow lighter lighter lighter lighter lighter lighter lighter lighter;
   path: (aCanvas shape roundedRectangle: self boundsInLocal radii:
   (BlCornerRadii radius: 3));
   draw.

  aCanvas text
	 baseline: (15@28);
    font: font;
    paint: Color darkGray;
    string: self cell minesAround asString;
    draw.       
 
	^self.
 ].