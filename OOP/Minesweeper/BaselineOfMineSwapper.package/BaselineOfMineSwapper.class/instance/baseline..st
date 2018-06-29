baselines
baseline: spec 
<baseline> 

spec for: #common do: [ 

spec 
baseline: 'Bloc' 
with: [ spec repository: 'github://pharo-graphics/Bloc:pharo6.1/src' ]. 
spec 
baseline: 'Brick' 
with: [ spec repository: 'github://pharo-graphics/Brick/src' ]. 
spec package: 'MineSwapper' with: [ spec requires: #('Bloc' 'Brick') ]. 
spec package: 'MineSwapperTests'. 
spec group: 'default' with: #('MineSwapper' 'MineSwapperTests') ]