
var terrainDict;

terrainDict.plain = { 
	dodgeModifier = 0, //gives bonus to dodge (positive is better)
	moveAmount = 1, //move points required to cross the tile
	damageModifier = 0,
};
terrainDict.mountain = {
	dodgeModifier = 0, //dummy value
	moveAmount = 1000, //effectively impassable terrain
	damageModifier = 0, //dummy value
};

terrainDict.forest = {
	dodgeModifier = 15,
	moveAmount = 2,
	damageModifier = 1,
};