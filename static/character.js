
/* FILE HANDLING CHARACTER CREATION AND WHATNOT
 * STAT BONUS COEFFICIENTS FOUND IN CONSTANTS //maybe move relevant constants to the relevant folder?
 * (Maybe make stat coefficients multiplicative off base stats???)
 * newCharacter takes a char data object
 * data must contain { player, x, y, type, strength, dexterity, agility, endurance }
 */


//receive a character data object

//player is which player it belongs to
//x and y are obvious

//type is your character's class (warrior etc)

//strength modifies damage/crit
//dexterity modifies tohit/crit
//endurance modifies defense/health
//agility modifies dodge/movement

function newCharacter(data) {
	var type = data.type;
	var character = {};
	character.x = data.x;
	character.y = data.y;
	character.player = data.player;
	character.type = type; //used for animation purposes, i guess?
	character.index = data.index;
	
	
	if (type === "warrior") {
		character.img = warriorImage[character.player-1];
	} else if (type === "mage") {
		character.img = mageImage[character.player-1];
	} else if (type === "archer") {
		character.img = archerImage[character.player-1];
	} else {
		character.img = "";
	}
	
	var strength = data.strength;
	var dexterity = data.dexterity;
	var endurance = data.endurance;
	var agility = data.agility;
	
	var hasMoved = false;
	//note that we are not enforcing integral values for anything
	//except movepoints. Fractional values of hp/damage are fine
	//we can just round for display purposes
	
	character.toHit = baseStats[type].toHit + (dexterity * dexHit);
	character.damage = baseStats[type].damage + (strength * strDmg);
	character.health = baseStats[type].health + (endurance * endHP);
	console.log(character.health);
	character.maxHealth = baseStats[type].health + (endurance * endHP); 
	character.range = baseStats[type].range;
	character.defense = baseStats[type].defense + (endurance * endDef); 
	//DEFENSE IS AN OPTIONAL STAT. DO NOT KNOW IF WE WANT TO IMPLEMENT
	
	
	character.movePoints = Math.floor(baseStats[type].movePoints + (agility * agilMov)); 
	//note 5 not need be inside the floor function but we may want
	//characters with fractional base movePoints so they benefit
	//more from agility, so for consistency's sake i include it inside
	
	character.maxMovePoints = Math.floor(baseStats[type].movePoints + (agility * agilMov));
	character.critChance = baseStats[type].critChance + (dexterity * dexCrit) + (strength * strCrit);
	character.dodgeChance = baseStats[type].dodgeChance + (agility + agilDodge);
	return character;
}

