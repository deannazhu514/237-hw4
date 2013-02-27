//calculation when someone attacks someone else
//returns true if hit was successful, false if not 

//The way i envision it, we use the false/true return values
//to determine animation.

//Furthermore if we receive a true value
//then that code also checks to see if they died
//and then display anothre animation. 
//Alternatively we could handle death inside this
//function but then the death animation would occur
//before we return (before we do the hit animation)
function calculateHit(attacker, defender) {
	var hitChance = attacker.toHit - defender.dodgeChance;
  console.log(attacker.toHit, defender.dodgeChance);
	var tile = map[defender.y][defender.x];
	var terrain = terrainDict[tile.type];
	var h = Math.random();
	hitChance -= terrain.dodgeModifier;
  console.log(hitChance);
	console.log(h, hitChance);
	if (h > hitChance) {
		return false;
	}
	damage = attacker.damage - terrain.damageModifier - defender.defense;
  h = Math.random();
  if (h < attacker.critChance) {
    damage = damage * 2;
  }
	defender.health -= damage;
	return true;
}

function isDead(character) {
	if (character.health <= 0) {
		return true;
	}
	return false;
}


