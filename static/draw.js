var canvas
var ctx;

function draw() {
  
	if (gameEndFlag) {
		drawVictory();
		//draw victory banner for p1 or p2
		return; //stop drawing the rest of the crap
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawMap();
	drawCharacters();
	drawCursor();
	drawMenu();
}

function drawMap() {
	//note: Assumes canvas width & height >= tileSize*map's width & height
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var tile = map[i][j];
			var img = getTileImage(tile.type);
			ctx.drawImage(img, j*tileSize, i*tileSize);
			if (tile.special === "scorespot") {
				//i dunno can we make the square tinted and glow red or something?
			}
		}
	}
}

function getTileImage(type) {
	if (type == "plain") {
		return plainImage;
	} else if (type == "mountain") {
		return mountainImage;
	} else if (type == "forest") {
		return forestImage;
	} else {
		alert("error: unknown type " + type);
		return "";
	}
}

function drawCharacters() {
	for (var i = 0; i < p1charList.length; i++) {
		var character = p1charList[i];
		if (!isDead(character)) {
			var ci = index[character.type];
			if (playerFocus === "characterMenu" && animationFlag){
				//draw move
				index[character.type] = ci++;
				animationFlag = false;		
			} else if (playerFocus === "viewing" && animationFlag){
				//draw attack
				console.log("draw attack");
				animationFlag = false;
			}
			
			ctx.drawImage(character.img, 
				sXList[character.type][0], 
				sYList[character.type][0],
				widthList[character.type][0], 
				heightList[character.type][0],	
				character.x*tileSize, character.y*tileSize,
				tileSize, tileSize);
			p1charList[i] = character;	
		} else {
			//character is dead :(
			ctx.drawImage(graveImg, 
				character.x*tileSize, character.y*tileSize,
				tileSize, tileSize);
		}
	}
	
	//a bit redundant code but in case we ever have asymmetry between
	//team sizes or whatnot
	//or perhaps coloring character types differently based on team? 
	for (var i = 0; i < p2charList.length; i++) {
		var character = p2charList[i];
		if (!isDead(character)) {
			var ci = index[character.type];
			ctx.drawImage(character.img, 
				sXList[character.type][0], sYList[character.type][0],
				widthList[character.type][0], heightList[character.type][0],
				character.x*tileSize, character.y*tileSize,
				tileSize, tileSize);
		}
		else {
			//character is dead :(
			ctx.drawImage(graveImg, 
				character.x*tileSize, character.y*tileSize,
				tileSize, tileSize);
		}
	}
}

function drawCursor() {	
	//DRAW MOVE PATH, IF ANY
	ctx.globalAlpha = 0.5
	for (var i = 0; i < listPath.length; i++) {
			var arrayTuple = listPath[i].split(",");
			var y = (arrayTuple[0] - 0);
			var x = (arrayTuple[1] - 0);
			
			ctx.drawImage(cursorImg, 
				x*tileSize, y*tileSize, tileSize, tileSize);
	}
	
	//DRAW CURSOR IMAGE
	ctx.globalAlpha = 1;
	ctx.drawImage(cursorImg, 
			cursor.x*tileSize, cursor.y*tileSize, tileSize, tileSize); 	
			
	//POSSIBLY CHANGE CURSOR BASED ON CURRENT ACTIOn
	//SUCH AS ATTACKING OR MOVING OR WHEN HOVERING
	//OVER A CLICKABLE CHARACTER
}

function drawMenu() {
	ctx.fillStyle = "#333";
	ctx.fillRect(menuX,menuY,menuWidth,menuHeight);

	var menu = [];
	var offset;

	ctx.font="20px Courier New";
	ctx.fillStyle = "#0FF";
	ctx.fillText("[SPACE] to select", menuX+20, 520);
	ctx.fillText("[ESC] to return", menuX+20, 550);
	
	//var instructions = "[space] to select";	
	
	if (!turnEnd) {
		if (playerFocus === "viewing") {
			if (hit) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Hit!", menuX+20, 200);	
			} else if (attacked) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Missed!", menuX+20, 200);
			} else {
				menu = statMenu;
				offset = 30;
			}
		} else if (playerFocus == "moving") {
				ctx.font="30px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Moves Left: "+currentChar.movePoints, menuX+20, 200);					
		} else if (playerFocus === "characterMenu") {
			offset = 30;
			menu = characterMenu;
			var character = currentChar;
			ctx.drawImage(character.img, 
					sXList[character.type][1], sYList[character.type][0],
					widthList[character.type][1], heightList[character.type][0],
					menuX+90, menuY+7*30,
					tileSize*2, tileSize*2);
			if (character.hasMoved) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Moved", menuX+60, 400);
			}
		} else if (playerFocus === "attacking") {
			ctx.font="40px Courier New";
			ctx.fillStyle = "#0FF";
			ctx.fillText("Attack!", menuX+20, 200);
		}  	
	}
	else { //turn has ended
		ctx.font="30px Courier New";
		ctx.fillStyle = "#0FF";
		ctx.fillText("Waiting for other player!", menuX+20, 400);
		menu = playerMenu;
		offset = 100;
	}
	
	if (playerFocus === "view stats") {
		menu = statMenu;
		offset = 30;
	}
	
	for (var i = 0; i < menu.length; i++) {
		ctx.font="20px Courier New";
		if (i === menuIndex && playerFocus !== "view stats") {
			ctx.fillStyle = "black";
			ctx.fillRect(menuX+10,menuY+(i+1)*offset, menuWidth-20, 30);
			ctx.fillStyle = "white";
		}
		else {
			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			ctx.fillRect(menuX+10,menuY+(i+1)*offset, menuWidth-20, 30);
			ctx.fillStyle = "red";
		}
		ctx.fillText(menu[i], menuX+20, menuY+(i+1)*offset+20);
	}
}

function drawVictory(){
	ctx.font="40px Courier New";
	ctx.fillStyle = "black";
	ctx.fillText("CONGRATULATIONS, YOU WON!", 200, 200);
}
