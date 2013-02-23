
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
	var character;
	character.x = data.x;
	character.y = data.y;
	character.player = data.player;
	character.type = type; //used for animation purposes, i guess?
	
	var strength = data.strength;
	var dexterity = data.dexterity;
	var endurance = data.endurance;
	var agility = data.agility;
	//note that we are not enforcing integral values for anything
	//except movepoints. Fractional values of hp/damage are fine
	//we can just 
	
	character.toHit = baseStats[type].toHit + (dexterity * dexHit);
	character.damage = baseStats[type].damage + (strength * strDmg);
	character.health = baseStats[type].health + (endurance * endHP);
	character.maxHealth = baseStats[type].health (endurance * endHP); 
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



//DEPRECATED
function createCharacter(data) {
	var type = data.type;
	var player = data.player;
	var x = data.x;
	var y = data.y;
	var character;
	character.x = (x - 0);
	character.y = (y - 0); // - 0 casts to int
	character.hasMoved = false; //THIS MAY NOT BE NECESSARY
	if (type === "warrior") {
		character.toHit = 0.80;
		character.damage = 10;
		character.health = 100;
		character.maxHealth = 100;
		character.range = 1;
		character.movePoints = 5;
		character.maxMovePoints = 5;
		character.critChance = 0.05;
		character.dodgeChance = .07;
		
		character.img = new Image();
		character.img.src = "" //IMAGE SOURCE HERE
	} else if (type === "mage") {
		character.toHit = 0.65;
		character.damage = 4;
		character.health = 50;
		character.maxHealth = 50;
		character.range = 1;
		character.movePoints = 5;
		character.maxMovePoints = 5;
		character.critChance = 0;
		character.dodgeChance = 0;
		
		character.img = new Image();
		character.img.src = "" //IMAGE SOURCE HERE
	} else if (type === "cleric") {
		character.toHit = 0.55;
		character.damage = 4;
		character.health = 65;
		character.maxHealth = 65;
		character.range = 1;
		character.movePoints = 5;
		character.maxMovePoints = 5;
		character.critChance = 0;
		character.dodgeChance = .05;
		
		character.img = new Image();
		character.img.src = "" //IMAGE SOURCE HERE
	} else if (type === "archer") {
		character.toHit = 0.75;
		character.damage = 10;
		character.health = 70;
		character.maxHealth = 70;
		character.range = 3;
		character.movePoints = 6;
		character.maxMovePoints = 6;
		character.critChance = 0.05;
		character.dodgeChance = 0.10;
		
		character.img = new Image();
		character.img.src = "" //IMAGE SOURCE HERE
	}
	
	if (player === '1') {
		p1charList.push(character);
	} else {
		p2charList.push(character);
	}
}