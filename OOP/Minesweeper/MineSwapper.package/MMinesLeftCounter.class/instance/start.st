accessing
start 

self text: ((BrRopedText string:count asString)  attributes:
                    {(BrTextForegroundAttribute paint: (Color white alpha: 0.7)).
                    (BrFontSizeAttribute size: 30).
                    (BrFontWeightAttribute weight: 60).
                    (BrFontGenericFamilyAttribute monospace).}
yourself ). 
count:=element mineSwapper minesLeftCount.