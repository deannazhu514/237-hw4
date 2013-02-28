var currentMovePoints = -1;
var sel_spell;
var dir, tempdir;

function onKeyUp(event) {
	if (event.keyCode === 65) { //a
		key_pressed["left"] = false;
	} else if (event.keyCode === 68) { //d
		key_pressed["right"] = false;
	} else if (event.keyCode === 87) { //w
		key_pressed["up"] = false;
	} else if (event.keyCode === 83) { //s
		key_pressed["down"] = false;
	}
}

function onKeyDown(event) {
	onKeyDownParser(event.keyCode);
	//why do i have a wrapper function? 
	//so that it easier facilitates holding down
	//keys for multiple key presses!
	//I can simply pass in the relevant int again
	//rather than copying over my logic. 
}

function onKeyDownParser(e) {
	//don't allow player to input commands while animations are playing
	if (animationFlag) { 
		return;
	}
	
	console.log(playerFocus, e);
	if (playerFocus == "viewing") {
		keyDownView(e);
	} else if (playerFocus == "moving") {
		keyDownMove(e);
	} else if (playerFocus == "characterMenu") {
		keyDownCharacterMenu(e);
	} else if (playerFocus == "attacking") {
		keyDownAttack(e);
	} else if (playerFocus == "view stats") {
		keyDownStats(e);
	} else if (playerFocus == "playerMenu") {
		keyDownPlayerMenu(e);
	} else if (playerFocus == "magic") {
		keyDownMagicMenu(e);
	} else if (playerFocus == "use magic") {
		keyDownMagicTarget(e);
  }
}

function keyDownView(e) {
	console.log("viewing", cursor.x, cursor.y);
	statMenu = [];
	if (!gameEndFlag) {
		attacked = false;
		hit = false;
		if (e === 65) { //a
			falsifyKeyPress();
			key_pressed["left"] = true;
			key_pressed.time = 0;
			if (cursor.x > 0) {
				--cursor.x;
			}
		} else if (e === 68) { //d
			falsifyKeyPress();
			key_pressed["right"] = true;
			key_pressed.time = 0;
			if (cursor.x < width - 1) {
				++cursor.x;
			}
		} else if (e === 87) { //w
			falsifyKeyPress();
			key_pressed["up"] = true;
			key_pressed.time = 0;
			if (cursor.y > 0) {
				--cursor.y;
			}
		} else if (e === 83) { //s
			falsifyKeyPress();
			key_pressed["down"] = true;
			key_pressed.time = 0;
			if (cursor.y < height - 1) {
				++cursor.y;
			}
		} else if (e === 13) { //spacebar: select button
			var sel_char = map[cursor.y][cursor.x].character;
			if (sel_char !== null) {
				currentChar = sel_char;
				playerFocus = "characterMenu";
				generateCharacterMenu();
			}
		} 
	} 
	
	if (e === 27) { 
	//escape: go to settings characterMenu (quit/forfeit/end all turn)
		//THE ONLY THING YOU CAN DO WHEN GAME IS OVER IS QUIT
		//TO BE IMPLEMENTED
		playerFocus = "playerMenu";
		generatePlayerMenu();
	}
	generateStatMenu();
}

function falsifyKeyPress() {
	key_pressed["left"] = false;
	key_pressed["right"] = false;
	key_pressed["up"] = false;
	key_pressed["down"] = false;
}

function generateStatMenu() {
	statMenu = [];
	var tile  = map[cursor.y][cursor.x];
	var terrain = terrainDict[tile.type];
	var i = 0;
	var offset = 30;
	if (tile.character === null) {
		for (var key in terrain) {
		  var terrainInfo = terrain[key];
		  if (terrainInfo !== 0) {
			statMenu.push(key+": "+terrainInfo);
			i++;
		  }
		}
		if (tile.special === "scorespot") {
			statMenu.push("scoring space");
		}
	} else {
		var viewchar = tile.character;
		var dchance = terrain.dodgeModifier.toFixed(2);
		var dstring = "";
		
		if (dchance > 0) {
		  dstring = " + " + dchance;
		} else if (dchance < 0) {
		  dstring = " - " + Math.abs(dchance);
		}
		
		var defMod = terrain.damageModifier;
		var type = tile.type;
		var defstring = "";
		if (defMod > 0) {
		  defstring = " + " + defMod + "("+type+")";
		} else if (defMod < 0) {
		  defstring = " - " + Math.abs(defMod) + "("+type+")";
		}
		
		templist = [];
		templist.push("Class: "+viewchar.type);
		templist.push("Health: "+viewchar.health+"/"+viewchar.maxHealth);
		if (viewchar.type === "mage") {
		  templist.push("Mana: " + viewchar.mana + "/" + maxMana);
		}
		templist.push("Damage: "+viewchar.damage);
		templist.push("Range: "+viewchar.range);
		templist.push("Defense: "+viewchar.defense + defstring);
		templist.push("toHit: "+(viewchar.toHit.toFixed(2)));
		templist.push("Critical Chance: " + (viewchar.critChance.toFixed(2)));
		templist.push("Dodge: "+(viewchar.dodgeChance.toFixed(2)) + dstring);
	
		statMenu = templist;
	}
}

function generateCharacterMenu() {
	characterMenu = [];
	if (playerNumber == currentChar.player && !currentChar.hasMoved) {
		characterMenu.push("Move: "+currentChar.movePoints+" left");
		characterMenu.push("Attack");
		if (currentChar.type === "mage") {
			characterMenu.push("Magic");
		}
		characterMenu.push("View Stats");
		characterMenu.push("Wait");
	} else {
		characterMenu.push("View Stats");
	}
	menuIndex = 0;
}

function keyDownCharacterMenu(e) {
	attacked = false;
	hit = false;
	var index = currentChar.index;
	var player = currentChar.player;
	var charList;
	if (player === 1) {
		charList = p1charList;
	} else {
		charList = p2charList;
	}
	
	if (e === 65) { //a
		falsifyKeyPress();
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (index == 0) {
			index = charList.length;
			cursor.x += charList.length;
		}
		currentChar = charList[--index];
		cursor.x = currentChar.x;
		cursor.y = currentChar.y;
		generateCharacterMenu();
	} else if (e === 68) { //d
		falsifyKeyPress();
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (index == charList.length-1) {
			index = -1;
			cursor.x -= charList.length;
		}
		currentChar = charList[++index];
		cursor.x = currentChar.x;
		cursor.y = currentChar.y;
		generateCharacterMenu();
	} else if (e === 87) { //w
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (menuIndex == 0) {
			menuIndex = characterMenu.length;
		}
		menuIndex--;
	} else if (e === 83) { //s
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (menuIndex == characterMenu.length-1) {
			menuIndex = -1;
		}
		menuIndex++;
	} else if (e === 13) {
		processMenuSelection(characterMenu[menuIndex]);
	} else if (e === 27) {
		playerFocus = "viewing";
	}
}

function processMenuSelection(item) {
	if (item.indexOf("Move") === 0) {
		playerFocus = "moving";
		listPath =  ["" + cursor.y +","+ cursor.x];
		//listPath =  [];
	} else if (item === "Attack") {
		playerFocus = "attacking";
	} else if (item === "View Stats") {
		playerFocus = "view stats";
		generateStatsMenu();
	} else if (item === "Magic") {
		playerFocus = "magic";
		generateMagicMenu();
	} else if (item === "Wait") {
		currentChar.hasMoved = true;
		playerFocus = "characterMenu";
	}
}

function keyDownMove(e) {
	var x = cursor.x;
	var y = cursor.y;
	var tile;
	var tuple;
	var i;
	if (e === 65) { //a
		falsifyKeyPress();
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (cursor.x > 0) {
			tempdir = 1;
			cursor.x--;
		} else { 
			return;
		}
	} else if (e === 68) { //d
		falsifyKeyPress();
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			tempdir = 2;
			cursor.x++;
		} else {
			return;
		}
	} else if (e === 87) { //w
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			tempdir = 3;
			cursor.y--;
		} else {
			return;
		}
	} else if (e === 83) { //s
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y < height-1) {
			tempdir = 0;
			cursor.y++;
		} else {
			return;
		}
	} else if (e === 13) { //space
		currentChar.direction = dir;
		map[currentChar.y][currentChar.x].character = null;
		currentChar.x = cursor.x;
		currentChar.y = cursor.y;
		//animationFlag = true;
		map[currentChar.y][currentChar.x].character = currentChar;
		listPath = [];
		playerFocus = "characterMenu";
		generateCharacterMenu();		
		return;
	} else if (e === 27) { //ESC
		listPath = [];
		playerFocus = "characterMenu";
		generateCharacterMenu();
		cursor.x = currentChar.x;
		cursor.y = currentChar.y;
		return;
	} else {
		return;
	}
	
	tuple = cursor.y + "," + cursor.x;
	i = listPath.indexOf(tuple);
	console.log("move", tuple, listPath);
	//check if reversing a move
	if (i !== -1) {
		console.log("i is : " + i);
		var templist = listPath.slice(i+1, listPath.length);
		listPath.splice(i+1,(listPath.length - i));
		for (var j = 0; j < templist.length; j++) {
			var arrayTuple = templist[j].split(",");
			var tx = arrayTuple[1] - 0;
			var ty = arrayTuple[0] - 0;
			tile = map[ty][tx]; // the - 0 just casts it to a number
			terrain = terrainDict[tile.type];
			currentChar.movePoints += terrain.moveCost;
		}
	} else {
		tile = map[cursor.y][cursor.x];
		if (isValidMove(tile)) {
			dir = tempdir;
			listPath.push("" + cursor.y + "," + cursor.x);
			currentChar.movePoints -= terrainDict[tile.type].moveCost;
		} else {
			console.log("invalid move");
			cursor.x = x;
			cursor.y = y;
		}
	}
}

function isValidMove(tile) {
	terrain = terrainDict[tile.type];
	if (currentChar.movePoints - terrain.moveCost < 0) {
		return false;
	}
	if (tile.character != null) {
		return false;
	}
	
	return true;
}

function keyDownAttack(e) {
	var x = cursor.x;
	var y = cursor.y;
	var dir;
	
	if (e === 65) { //a
		falsifyKeyPress();
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (cursor.x > 0) {
			cursor.x--;
		} else { 
			return; 
		}
	} else if (e === 68) { //d
		falsifyKeyPress();
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			cursor.x++;
		} else { 
			return; 
		}
	} else if (e === 87) { //w
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			cursor.y--;
		} else { 
			return; 
		}
	} else if (e === 83) { //s
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y < height - 1) {
			cursor.y++;
		} else { 
			return; 
		}
	} else if (e === 13) {//spacebar: select button
		var enemy_char = map[cursor.y][cursor.x].character;
		if ((enemy_char !== null) 
			&& (enemy_char.player !== currentChar.player)
			&& (!isDead(enemy_char))){
			if (calculateHit(currentChar, enemy_char)) {
			//look at calculate hit: we might want to 
			//an extra effect upon critical hit
				animation = "attack";
				animationFlag = false;
				hit = true;
				console.log("hit", hit, damage);
				
				if (isDead(enemy_char)) {
					map[enemy_char.y][enemy_char.x].character = null;
					//display death animation	
				}
			}
			else {
				hit = false;
			}
		}		
		currentChar.hasMoved = true;
		attacked = true;
		playerFocus = "characterMenu";
		generateCharacterMenu();
		return;
	} else if (e === 27) { //escape
		playerFocus = "characterMenu";
		generateCharacterMenu();
		return;
	} else { 
		return; 
	}
	
	if ((Math.abs(cursor.x - currentChar.x) + Math.abs(cursor.y - currentChar.y)) 
				> currentChar.range) {
		//can't attack farther than your range!
		cursor.x = x;
		cursor.y = y;
	}
}

function keyDownPlayerMenu(e) {
	if (e === 13) {
		processPlayerMenuSelection();
		playerMenu = [];
		playerFocus = "viewing";
	} else if (e === 27) { 
		playerMenu = [];
		playerFocus = "viewing";
	} else if (e === 83) {
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		menuIndex = (menuIndex + 1) % playerMenu.length;
	} else if (e === 87) {
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		menuIndex = (menuIndex - 1);
		if (menuIndex < 0) {
		  menuIndex = playerMenu.length -1;
		}
	}
}

function generateStatsMenu(){
	var tile = map[currentChar.y][currentChar.x];
	var terrain = terrainDict[tile.type];
	var dchance = terrain.dodgeModifier.toFixed(2);
	var dstring = "";
	if (dchance > 0) {
		dstring = " + " + dchance;
	} else if (dchance < 0) {
		dstring = " - " + Math.abs(dchance);
	}
	var defMod = terrain.damageModifier;
	var defstring = "";
	if (defMod > 0) {
		defstring = " + " + defMod;
	} else if (defMod < 0) {
		defstring = " - " + Math.abs(defMod);
	}
 
	statMenu = [];
	statMenu.push("Class: "+currentChar.type);
	statMenu.push("Health: "+currentChar.health+"/"+currentChar.maxHealth);
	if (currentChar.type === "mage") {
		  statMenu.push("Mana: " + currentChar.mana + "/" + maxMana);
	}
	statMenu.push("Damage: "+currentChar.damage);		
	statMenu.push("Range: "+currentChar.range);
	statMenu.push("Defense: "+currentChar.defense + defstring);
	statMenu.push("toHit: "+(currentChar.toHit.toFixed(2)));
	statMenu.push("Critical Chance: " + currentChar.critChance.toFixed(2));
	statMenu.push("Dodge: "+(currentChar.dodgeChance).toFixed(2) + dstring);	
}

function keyDownStats(e) {
	if (e === 27) {
		playerFocus = "characterMenu";
		generateCharacterMenu();
	}
}

function generatePlayerMenu() {
	playerMenu = [];
	
	if (!gameEndFlag) {
		playerMenu.push("End Turn");
		playerMenu.push("Surrender");
	}
	playerMenu.push("Main Menu");
	menuIndex = 0;
}

function processPlayerMenuSelection() {
	var item = playerMenu[menuIndex];
	if (item === "End Turn") {
		endTurn();
	} else if (item === "Surrender") {
    var victPlayer = (playerNumber % 2) + 1;
		currentGame.status = "p"+victPlayer+"Victory"; //lol this is so hacky
		gameEndFlag = true;
		
	} else if (item === "Main Menu") {
		location.reload();
	}
}

function generateMagicMenu() {
	magicMenu = [];
	magicMenu.push(mageSpells.fireball.name);
	magicMenu.push(mageSpells.lightning.name);
	menuIndex = 0;
}

function keyDownMagicMenu(e) {
	if (e === 83) {
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		
		menuIndex = (menuIndex + 1) % magicMenu.length;
	} else if (e === 87) {
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		
		menuIndex--;
		if (menuIndex < 0) 
			menuIndex = magicMenu.length -1;
	} else if (e === 13) {
		if (canCast(magicMenu[menuIndex])) {
		  magicMenu = [];
		  playerFocus = "use magic";
		}
	} else if (e === 27) {
		playerFocus = "characterMenu";
		magicMenu = [];
		generateCharacterMenu();
	} else {
		return;
	}
}

function canCast(item) {
  if (item === mageSpells.fireball.name) {
    if (currentChar.mana >= mageSpells.fireball.cost) {
      sel_spell = mageSpells.fireball;
      return true;
    } 
  } else if (item === mageSpells.lightning.name) {
    if (currentChar.mana >= mageSpells.lightning.cost) {
      sel_spell = mageSpells.lightning;
      return true;
    }
  }
  return false;
}

function keyDownMagicTarget(e) {
  var x = cursor.x;
  var y = cursor.y;
  if (e === 65) { //a
		falsifyKeyPress();
		key_pressed["left"] = true;
		key_pressed.time = 0;

		if (cursor.x > 0) {
			cursor.x--;
		} else { 
			return;
		}
	} else if (e === 68) { //d
		falsifyKeyPress();
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			cursor.x++;
		} else {
			return;
		}
	} else if (e === 87) { //w
		falsifyKeyPress();
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			cursor.y--;
		} else {
			return;
		}
	} else if (e === 83) { //s
		falsifyKeyPress();
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y < height-1) {
			cursor.y++;
		} else {
			return;
		}
	} else if (e === 13) {
		if (castSpell(cursor.x, cursor.y)) {
			currentChar.hasMoved = true;
			animationFlag = true;
			playerFocus = "characterMenu";
			generateCharacterMenu();
		}
	} else if (e === 27) {
		playerFocus = "characterMenu";
		magicMenu = [];
		generateCharacterMenu();
	}
	if (Math.abs(cursor.x - currentChar.x) + Math.abs(cursor.y - currentChar.y) > sel_spell.range) {
    cursor.x = x;
    cursor.y = y;
  }	
}

function castSpell(x, y) {
	var spell;
	spell_x = x;
	spell_y = y;
	if (sel_spell.name === mageSpells.fireball.name) {
		animation = "fireball";
		spell = mageSpells.fireball;
		spell.cast(x,y);
		currentChar.mana -= spell.cost;
		return true;
	} else if (sel_spell.name === mageSpells.lightning.name) {
		if (map[y][x].character !== null) {
		  animation = "lightning";
		  spell = mageSpells.lightning;
		  spell.cast(x,y);
		  currentChar.mana -= spell.cost;
		  if (spell_x == currentChar.x) {
			if (spell_y > currentChar.y) dir = 0;
			else dir = 3;
		  } else if (spell_y == currentChar.y) {
			if (spell_x > currentChar.x) dir = 2;
			else dir = 1;
		  } else {
			dir = 3;
			angle = Math.atan2((currentChar.y-spell_y),(currentChar.x-spell_x));
			//angle = (Math.PI+angle)%Math.PI;
		  }
		  return true;
		}
  }
  return false; //invalid target: only possible for lightning, which must
                //select a character, fireball can select terrain
}
/* //FOR NOW NOT USING MOUSE EVENTS
function onMouseMove(event) {
	
	var x = event.pageX;
	var y = event.pageY;
	cursor.x = x;
	cursor.y = y;
	
	if (isDrawingPathFlag) {
		
	}
}

function onMouseDown(event) {
	var x = event.pageX;
	var y = event.pageY;
	if (playerAction == "moving") {
		if ((x >= currentChar.x*tileSize) 
		&& (x < (currentChar.x + 1) * tileSize)
		&& (y >= currentChar.y*tileSize)
		&& (y < (currentChar.y + 1) * tileSize)) {
			isDrawingPathFlag = true;
	}
	
	
}

function onMouseUp(event) {

}*/