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
	if (animationFlag) { 
	//don't allow player to input commands while animations are playing
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
	} else if (playerFocus == "magicMenu") {
		
	}
}

function keyDownView(e) {
	console.log("viewing", cursor.x, cursor.y);
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
		} else if (e === 32) { //spacebar: select button
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
	console.log(playerFocus, cursor.x, cursor.y);
}

function falsifyKeyPress() {
	key_pressed["left"] = false;
	key_pressed["right"] = false;
	key_pressed["up"] = false;
	key_pressed["down"] = false;
}

function generateCharacterMenu() {
	characterMenu = [];
	if (playerNumber === currentChar.player) {
		characterMenu.push("Move");
		characterMenu.push("Attack");
		if (currentChar.type === "mage") {
			characterMenu.push("Magic");
		}
		characterMenu.push("View Stats");
		characterMenu.push("Wait");
	} else {
		characterMenu.push("View Stats");
	}
	//pop up characterMenu for move/attack/view stats?
	menuIndex = 0;
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
	} else if (e === 32) {
		processMenuSelection(characterMenu[menuIndex]);
	} else if (e === 27) {
		playerFocus = "viewing";
	}
}

function processMenuSelection(item) {
	if (item === "Move") {
		playerFocus = "moving";
		listPath = ["" + cursor.y +","+ cursor.x];
	} else if (item === "Attack") {
		playerFocus = "attacking";
	} else if (item === "View Stats") {
		playerFocus = "view stats";
		generateStatsMenu();
	} else if (item === "Magic") {
		playerFocus = "menuMagic";
	} else if (item === "Wait") {
		currentChar.hasMoved = true;
		playerFocus = "viewing";
	}
	console.log(item);
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
	} else if (e === 32) { //space
		listPath = [];
		map[currentChar.y][currentChar.x].character = null;
		currentChar.x = cursor.x;
		currentChar.y = cursor.y;
		map[currentChar.y][currentChar.x].character = currentChar;
		//THIS IS JUST PLACEHOLDER: WE SHOULD PUT IN ANIMATIONS	
		return;
	} else if (e === 27) { //ESC
		listPath = [];
		currentChar.movePoints = currentChar.maxMovePoints;
		playerFocus = "characterMenu";
		generateCharacterMenu();
		return;
	} else {
		return;
	}
	
	tuple = cursor.y + "," + cursor.x;
	i = listPath.indexOf(tuple);
	console.log("move", cursor.y, cursor.x, tuple, listPath);
	//check if reversing a move
	if (i !== -1) {
		console.log("reverse");
		listPath.splice(i+1,(listPath.length - i+1));
		currentChar.movePoints = currentChar.maxMovePoints;
		 for (var i = 1; i < listPath.length; i++) {
			 var arrayTuple = listPath[i].split(",");
			 tile = map[(arrayTuple[0] - 0)][(arrayTuple[1] - 0)]; // the - 0 just casts it to a number
			 terrain = terrainDict[tile.type];
			 currentChar.movePoints += terrain.moveCost;
		 }
	} else {
		tile = map[cursor.y][cursor.x];
		if (isValidMove(tile)) {
			listPath.push("" + y + "," + x);
			currentChar.movePoints -= terrainDict[tile.type].moveCost;
			lastMove = terrainDict[tile.type].moveCost;
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
	} else if (e === 32) {//spacebar: select button
		var enemy_char = map[cursor.y][cursor.x].character;
		if ((enemy_char !== null) 
			&& (enemy_char.player !== currentChar.player)
			&& (!isDead(enemy_char))){
			if (calculateHit(currentChar, enemy_char)) {
				hit = true;
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Hit!", menuX+20, 200);
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
		playerFocus = "viewing";
		return;
	} else if (e === 27) { //escape
		playerFocus = "characterMenu";
		generateCharacterMenu();
		return;
	} else { 
		return; 
	}
	
	if ((Math.abs(cursor.x - currentChar.x) + Math.abs(cursor.y - currentChar.y)) > currentChar.range) {
		//can't attack farther than your range!
		cursor.x = x;
		cursor.y = y;
	}
}

function keyDownPlayerMenu(e) {
	if (e === 32) {
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
		menuIndex = (menuIndex - 1) % playerMenu.length;
	}
}

function generateStatsMenu(){
	statMenu = [];
	statMenu.push("Class: "+currentChar.type);
	statMenu.push("toHit: "+currentChar.toHit);
	statMenu.push("damage: "+currentChar.damage);
	statMenu.push("Health: "+currentChar.health+"/"+currentChar.maxHealth);
	statMenu.push("Range: "+currentChar.range);
	statMenu.push("Defense: "+currentChar.defense);
}

function keyDownStats(e) {
	if (e === 27) {
		playerFocus = "characterMenu";
		generateCharacterMenu();
	}
}

function generatePlayerMenu() {
	playerMenu = [];
	playerMenu.push("Main Menu");
	
	if (!gameEndFlag) {
		playerMenu.push("End Turn");
		playerMenu.push("Surrender");
	}
	menuIndex = 0;
}

function processPlayerMenuSelection() {
	var item = playerMenu[menuIndex];
	if (item === "End Turn") {
		endTurn();
	} else if (item === "Surrender") {
		currentGame.status = "p"+playerNumber+"Victory"; //lol this is so hacky
		gameEndFlag = true;
		endTurn();
	} else if (item === "Main Menu") {
		// return to main menu some how
	}
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