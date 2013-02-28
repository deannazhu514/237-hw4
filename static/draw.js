var canvas
var ctx;

function draw() {
	if (gameEndFlag) {
		drawVictory();
		return;
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
				ctx.globalAlpha = 0.7;
				ctx.drawImage(img, j*tileSize, i*tileSize);
			}
			else {
				ctx.globalAlpha = 0.5;
				ctx.drawImage(img, j*tileSize, i*tileSize);
			}
		}
		ctx.globalAlpha = 1;
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
					} else {
						spell_flag = 0;
						animationFlag = false;		
					}
				} else if (animation === "lightning") {
					if (spell_flag < 100) {
						ctx.save();
						if (angle != 0)
							ctx.rotate(angle);
						console.log("rotate?", angle, dir);
						ctx.drawImage(lightningImg, 
						lightningsX[dir], lightningsY[dir],
						lightningWidth[dir], lightningHeight[dir],	
						spell_x*tileSize, (spell_y+1)*tileSize,
						tileSize, (character.y-spell_y-1)*tileSize);
						spell_flag++;
						ctx.restore();
					} else {
						spell_flag = 0;
						animationFlag = false;		
						angle = 0;
					} 
				} /*else if (animation === "attack") {
					if (attack_flag < 100) {
						if (currentChar.type == "archer") {
								ctx.drawImage(arrowImg, 
								arrowsX[dir], arrowsY[dir],
								arrowWidth[dir], arrowHeight[dir],	
								attack_x*tileSize, (attack_y+1)*tileSize,
								tileSize, (character.y-attack_y-1)*tileSize);
						} else if (currentChar.type == "warrior") {
								ctx.drawImage(swordImg, 
								swordsX[dir], swordsY[dir],
								swordWidth[dir], swordHeight[dir],	
								attack_x*tileSize, (attack_y+1)*tileSize,
								tileSize, (character.y-spell_y-1)*tileSize);
						}
						attack_flag++;
					} else {
						attack_flag = 0;
						animationFlag = false;		
						angle = 0;
					} 	
				}*/					
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
	
	//var instructions = "[ENTER] to select";	
	
	if (!turnEnd) {
		ctx.font="20px Courier New";
		ctx.fillStyle = "#0FF";
		if (playerFocus === "viewing") {
			ctx.fillText("[ESC] to player menu", menuX, 550);
		} else {
			ctx.fillText("[ESC] to return", menuX, 550);
		}
	
		if (playerFocus === "viewing") {
				menu = statMenu;
				offset = 30;
				if (map[cursor.y][cursor.x].character !== null) {
					ctx.font="18px Courier New"
					ctx.fillStyle = "#0FF";
					ctx.fillText("[ENTER] to view team", menuX, 520);
				}
		} else if (playerFocus == "moving") {
				ctx.font="30px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Moves Left: "+currentChar.movePoints, menuX+20, 200);			
		} else if (playerFocus === "characterMenu") {
			if (hit) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Hit!", menuX+20, 200);					
			} else if (attacked) {
				ctx.font="40px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText("Missed!", menuX+20, 200);
			} else {
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
				ctx.fillText("[ENTER] to select action", menuX, 520);	
								
				if (character.hasMoved) {
					ctx.font="40px Courier New";
					ctx.fillStyle = "#0F0";
					ctx.fillText("Move Made", menuX+30, 350);
				}
			}
		} else if (playerFocus === "attacking") {
			ctx.font="40px Courier New";
			ctx.fillStyle = "#F00";
			ctx.fillText("Attack!", menuX+20, 200);
			ctx.fillStyle = "#0FF";
			ctx.font="18px Courier New"
			ctx.fillStyle = "#0FF";
			ctx.fillText("[ENTER] to attack", menuX, 520);		
		} else if (playerFocus === "magic") {
			menu = magicMenu;
			offset = 100;
			ctx.font="18px Courier New"
			ctx.fillStyle = "#0FF";
			ctx.fillText("[ENTER] to cast spell", menuX, 520);	
		}  else if (playerFocus === "use magic") {
			ctx.font="30px Courier New";
			ctx.fillStyle = "#F0F";
			ctx.fillText("Casting spell!", menuX+20, 300);
		} else if (playerFocus === "playerMenu") {
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
	ctx.globalAlpha = 1;
	ctx.font="40px Courier New";
	ctx.fillStyle = "red";
	if (currentGame.status.indexOf(playerNumber) != -1)
		ctx.fillText("CONGRATULATIONS PLAYER"+playerNumber+", YOU WON!", 200, 200);
	else	
		ctx.fillText("SORRY, YOU LOST", 200, 200);
}
