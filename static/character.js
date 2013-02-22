function createCharacter(data) {
	var type = data.type;
	var player = data.player;
	var x = data.x;
	var y = data.y;
	var character;
	character.x = (x - 0);
	character.y = (y - 0);
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