drawing
drawBacksideOn: aCanvas

        aCanvas fill
          paint: Color gray;
          path: (aCanvas shape roundedRectangle: self boundsInLocal radii:
           (BlCornerRadii radius: 3));
          draw.