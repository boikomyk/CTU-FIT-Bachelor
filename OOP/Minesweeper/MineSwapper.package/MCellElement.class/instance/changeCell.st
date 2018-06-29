as yet unclassified
changeCell
	| animation |

	animation := BlTransformAnimation scale: 1 @ 1.	
	animation
		absolute;
		easing: BlQuinticInterpolator default;
		duration: 0.3 seconds.
	
	animation startOn: self