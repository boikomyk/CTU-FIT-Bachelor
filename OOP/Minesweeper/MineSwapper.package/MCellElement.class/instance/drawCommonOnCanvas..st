as yet unclassified
drawCommonOnCanvas: aCanvas "unusable"
        | radius |
        super drawPathOnSpartaCanvas: aCanvas.
        radius := 12.
        aCanvas fill
          paint: Color purple;
          path: (aCanvas shape roundedRectangle: self boundsInLocal radii:
           (BlCornerRadii radius: 12));
          draw.