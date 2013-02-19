function createCharacter(type, x, y, player) {
	var character;
	character.x = (x - 0);
	character.y = (y - 0);
	character.hasMoved = false;
	if (type === "warrior") {
		character.toHit = 0.80;
		character.damage = 10;
		character.health = 100;
		character.range = 1;
		character.movePoints = 5;
		character.critChance = 0.05;
		character.dodgeChacne = .07;
	} else if (type === "mage") {
		character.toHit = 0.65;
		character.damage = 4;
		character.health = 50;
		character.range = 1;
		character.movePoints = 5;
		character.critChance = 0;
		character.dodgeChance = 0;
	} else if (type === "cleric") {
		character.toHit = 0.55;
		character.damage = 4;
		character.health = 65;
		character.range = 1;
		character.movePoints = 5;
		character.critChance = 0;
		character.dodgeChance = .05;
	} else if (type === "archer") {
		character.toHit = 0.75;
		character.damage = 10;
		character.health = 70;
		character.range = 3;
		character.movePoints = 6;
		character.critChance = 0.05;
		character.dodgeChance = 0.10;
	}
	
	if (player === '1') {
		p1charList.push(character);
	} else {
		p2charList.push(character);
	}
}