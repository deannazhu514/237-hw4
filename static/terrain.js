
var terrainDict = {};

terrainDict.plain = { 
	dodgeModifier: 0, //gives bonus to dodge (positive is better)
	moveCost: 1, //move points required to cross the tile
	damageModifier: 0
};
terrainDict.mountain = {
	dodgeModifier: 0, //dummy value
	moveCost: 10000, //effectively impassable terrain
	damageModifier: 0 //dummy value
};

terrainDict.forest = {
	dodgeModifier : .15,
	moveCost : 2,
	damageModifier : 1
};

terrainDict.valley = {
  dodgeModifier : -.2,
  moveCost : 1, 
  damageModifier : -1
};