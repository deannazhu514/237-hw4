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
			if (tile.special === "scorespot") {
				ctx.globalAlpha = 1;
				ctx.drawImage(img, j*tileSize, i*tileSize);
			}
			else {
				ctx.globalAlpha = 0.8;
				ctx.drawImage(img, j*tileSize, i*tileSize);
			}
		}
	}
	ctx.globalAlpha = 1;
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
	var cList = (playerNumber == 1) ? p1charList: p2charList;
	var other = (playerNumber == 1) ? p2charList: p1charList;
	
	for (var i = 0; i < other.length; i++) {
		var character = other[i];
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

	for (var i = 0; i < cList.length; i++) {
		var character = cList[i];
		if (!isDead(character)) {
			var ci = index[character.type];
			
			//console.log(character.direction);
			ctx.drawImage(character.img, 
					sXList[character.type][0], 
					sYList[character.type][character.direction],
					widthList[character.type][0], 
					heightList[character.type][0],	
					character.x*tileSize, character.y*tileSize,
					tileSize, tileSize);

			if (animationFlag){
				if (animation === "fireball") {
					if (spell_flag < 100) {
						ctx.drawImage(fireballImg, 
						fireballsX[0], 
						fireballsY[0],
						fireballWidth, 
						fireballHeight,	
						spell_x*tileSize, spell_y*tileSize,
						tileSize, tileSize);
						spell_flag++;
					}
					else {
						spell_flag = 0;
						animationFlag = false;		
					}
				} else if (animation === "lightning") {
					if (spell_flag < 100) {
						ctx.drawImage(lightningImg, 
						lightningsX[3], lightningsY[3],
						lightningWidth[3], lightningHeight[3],	
						spell_x*tileSize, (spell_y+1)*tileSize,
						tileSize, (character.y-spell_y-1)*tileSize);
						spell_flag++;
					}
					else {
						spell_flag = 0;
						animationFlag = false;		
					}
				} 
			}
		} else {
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
	
	//var instructions = "[space] to select";	
	
	if (!turnEnd) {
		ctx.font="20px Courier New";
		ctx.fillStyle = "#0FF";
		if (playerFocus === "viewing") {
			ctx.fillText("[ESC] to player menu", menuX, 550);
		} else {
			ctx.fillText("[ESC] to return", menuX, 550);
		}
	
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
				if (map[cursor.y][cursor.x].character !== null) {
					ctx.font="18px Courier New"
					ctx.fillStyle = "#0FF";
					ctx.fillText("[SPACE] to view team", menuX, 520);
				}
			}
		} else if (playerFocus == "moving") {
				ctx.font="30px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Moves Left: "+currentChar.movePoints, menuX+20, 200);			} else if (playerFocus === "characterMenu") {
			offset = 30;
			menu = characterMenu;
			var character = currentChar;
			ctx.drawImage(character.img, 
					sXList[character.type][1], sYList[character.type][0],
					widthList[character.type][1], heightList[character.type][0],
					menuX+90, menuY+7*30,
					tileSize*2, tileSize*2);
			ctx.fillStyle = "#0FF";
			ctx.font="18px Courier New"
			ctx.fillStyle = "#0FF";
			ctx.fillText("[SPACE] to select action", menuX, 520);		
			if (character.hasMoved) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0F0";
				ctx.fillText("Move Made", menuX+30, 350);
			}
		} else if (playerFocus === "attacking") {
			ctx.font="40px Courier New";
			ctx.fillStyle = "#F00";
			ctx.fillText("Attack!", menuX+20, 200);
			ctx.fillStyle = "#0FF";
			ctx.font="18px Courier New"
			ctx.fillStyle = "#0FF";
			ctx.fillText("[SPACE] to attack", menuX, 520);		
		} else if (playerFocus === "magic") {
			menu = magicMenu;
			offset = 100;
			ctx.font="18px Courier New"
			ctx.fillStyle = "#0FF";
			ctx.fillText("[SPACE] to cast spell", menuX, 520);	
		}  else if (playerFocus === "use magic") {
			ctx.font="30px Courier New";
			ctx.fillStyle = "#F0F";
			ctx.fillText("Casting spell!", menuX+20, 300);
		} else if (playerFocus === "playerMenu") {
			console.log(menu);
			menu = playerMenu;
			offset = 100;		
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
		if (i === menuIndex && playerFocus !== "view stats"
				&& playerFocus !== "viewing") {
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
