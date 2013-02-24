

//key_pressed.time to be used later for holding
//down the key and moving multiple spaces
//(short initial pause and then repeated movements)
//will be implemented later

function onKeyDown(event) {
	if (animationFlag) { //don't allow player to input commands while animations are playing
		return;
	}
	if (playerFocus = "viewing") {
		keyDownView(event.keyCode);
	} else if (playerFocus = "moving") {
		keyDownMove(event.keyCode);
	} else if (playerFocus = "characterMenu") {
		keyDownCharacterMenu(event.keyCode);
	} else if (playerFocus = "attacking") {
		keyDownAttack(event.keyCode);
	} else if (playerFocus = "view stats") {
		keyDownStats(event.keyCode);
	}
}

function keyDownStats(e) {
	if (e === 27) {
		playerFocus = "characterMenu";
		generateCharacterMenu();
	}
}

function keyDownAttack(event.keyCode) {
	var x = cursor.x;
	var y = cursor.y;
	if (e === 65) { //a
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (cursor.x > 0) {
			cursor.x--;
		} else { return; }
	} else if (e === 68) { //d
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			cursor.x++;
		} else { return; }
	} else if (e === 87) { //w
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y < height - 1) {
			cursor.y++;
		} else { return; }
	} else if (e === 83) { //s
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			cursor.y--;
		} else { return; }
	} else if (e === 32) {//spacebar: select button
		var enemy_char = map[cursor.y][cursor.x].character;
		if ((enemy_char !== null) && (enemy_char.player !== currentChar.player)){
			if (calculateHit(currentChar, enemy_char)) {
				if (isDead(enemy_char)) {
					//display death animation
				}
			}
		}
		currentChar.hasMoved = true;
		playerFocus = "viewing";
		return;
	} else if (e === 27) { //escape
		playerFocus = "characterMenu";
		generateCharacterMenu();
		return;
	} else { return; }
	if ((Math.abs(cursor.x - currentChar.x) + Math.abs(cursor.y - currentChar.y)) > currentChar.range) {
		//can't attack farther than your range!
		cursor.x = x;
		cursor.y = y;
	}
}

function keyDownCharacterMenu(e) {
	var index = currentChar.index;
	var player = currentChar.player;
	var charList;
	if (player === 1) {
		charList = p1charList;
	} else {
		charList = p2charList;
	}
	if (e === 65) { //a
		key_pressed["left"] = true;
		key_pressed.time = 0;
		currentChar = charList[(currentChar.index - 1)%charList.length];
		generateCharacterMenu();
	} else if (e === 68) { //d
		key_pressed["right"] = true;
		key_pressed.time = 0;
		currentChar = charList[(currentChar.index + 1)%charList.length];
		generateCharacterMenu();
	} else if (e === 87) { //w
		key_pressed["up"] = true;
		key_pressed.time = 0;
		menuIndex = (menuIndex - 1) %menu.length;
	} else if (e === 83) { //s
		key_pressed["down"] = true;
		key_pressed.time = 0;
		menuIndex = (menuIndex +1)%menu.length;
	} else if (e === 32) {
		processMenuSelection(menu[menuIndex]);
	} else if (e === 27) {
		playerFocus = "viewing";
	}
}

function generateCharacterMenu() {
	menu = [];
	if ((playerNumber === currentChar.player) 
	 && (currentChar.hasMoved ===false)) {
		menu.push("Move");
		menu.push("Attack");
		if (currentChar.type === "mage") {
			menu.push("Magic");
		}
		menu.push("View Stats");
		menu.push("Wait");
	} else {
		menu.push("View Stats");
	}
	//pop up menu for move/attack/view stats?
	menuIndex = 0;
}

function processMenuSelection(item) {
	if (item === "Move") {
		playerFocus = "moving";
		listPath = ["" + cursor[y] +","+ cursor[x]];
	} else if (item === "Attack") {
		playerFocus = "attack";
	} else if (item === "View Stats") {
		displayStats(currentChar);
	} else if (item === "Magic") {
		
	} else if (item === "Wait") {
		currentChar.hasMoved = true;
		playerFocus = "viewing";
	}
}

function isValidMove(tile) {
	terrain = terrainDict[tile.type];
	if (currentCharacter.movePoints - terrain.moveCost < 0) {
		return false;
	}
	if (tile.character != null) {
		return false;
	}
	return true;
}


function keyDownMove(e) {
	var x = cursor.x;
	var y = cursor.y;
	var tile;
	var tuple;
	var i;
	if (e === 65) { //a
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (cursor.x > 0) {
			cursor.x--;
		} else { 
			return;
		}
	} else if (e === 68) { //d
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			cursor.x++;
		} else {
			return;
		}
	} else if (e === 87) { //w
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y < height - 1) {
			cursor.y++;
		} else {
			return;
		}
	} else if (e === 83) { //s
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			cursor.y--;
		} else {
			return;
		}
	} else if (e === 32) {
		character.x = cursor.x;
		character.y = cursor.y;
		//THIS IS JUST PLACEHOLDER: WE SHOULD PUT IN ANIMATIONS
		
		return;
	} else if (e === 27) {
		playerFocus = "characterMenu";
		generateCharacterMenu();
		listPath = [];
		return;
	} else {
		return;
	}
	tuple = "" + cursor.y + "," + cursor.x;
	i = pathList.indexOf(tuple);
	if (i !== -1) {
		pathList.splice(i+1,(pathList.length - i+1));
		character.movePoints = character.maxMovePoints;
		for (var i = 1; i < pathList.length; i++) {
			var arrayTuple = pathList[i].split(",");
			tile = map[(arrayTuple[0] - 0)][(arrayTuple[1] - 0)]; // the - 0 just casts it to a number
			terrain = terrainDict[tile.type];
			character.movePoints -= terrain.moveCost;
		}
	} else {
		tile = map[cursor.y][cursor.x];
		if (isValidMove(tile)) {
			pathList.push("" + cursor.y + "," + cursor.x);
			character.movePoints -= terrainDict[tile.type].moveCost;
		} else {
			cursor.x = x;
			cursor.y = y;
		}
	}
}

function keyDownView(e) {
	if (e === 65) { //a
		key_pressed["left"] = true;
		key_pressed.time = 0;
		if (cursor.x > 0) {
			cursor.x--;
		}
	} else if (e === 68) { //d
		key_pressed["right"] = true;
		key_pressed.time = 0;
		if (cursor.x < width - 1) {
			cursor.x++;
		}
	} else if (e === 87) { //w
		key_pressed["up"] = true;
		key_pressed.time = 0;
		if (cursor.y < height - 1) {
			cursor.y++;
		}
	} else if (e === 83) { //s
		key_pressed["down"] = true;
		key_pressed.time = 0;
		if (cursor.y > 0) {
			cursor.y--;
		}
	} else if (e === 32) {//spacebar: select button
		var sel_char = map[cursor.y][cursor.x].character;
		if (sel_char !== null) {
			currentChar = sel_char;
			playerFocus = "characterMenu";
			generateCharacterMenu();
		}
	} else if (e === 27) { //escape: go to settings menu (quit/forfeit/end all turn)
		//TO BE IMPLEMENTED
	}
}

function onKeyUp(event) {
	if (e === 65) { //a
		key_pressed["left"] = false;
	} else if (e === 68) { //d
		key_pressed["right"] = false;
	} else if (e === 87) { //w
		key_pressed["up"] = false;
	} else if (e === 83) { //s
		key_pressed["down"] = false;
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