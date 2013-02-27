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
	displayTerrainStats();
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

function displayTerrainStats() {
  var tile  = map[cursor.y][cursor.x];
  var terrain = terrainDict[tile.type];
  var i =0;
  var offset = 30;
  if (tile.character === null) {
    for (var key in terrain) {
      ctx.font="20px Courier New";
      var terrainInfo = terrain[key];
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      if (terrainInfo !== 0) {
        ctx.fillRect(menuX+10,menuY+(i+1)*offset+310, menuWidth-20, 30);
        ctx.fillStyle = "red";
        ctx.fillText(key + ": " + terrainInfo, menuX+20, menuY+(i+1)*offset+330);
        i++;
      }
    }
    if (tile.special === "scorespot") {
      ctx.fillRect(menuX+10,menuY+(i+1)*offset+310, menuWidth-20, 30);
      ctx.fillStyle = "red";
      ctx.fillText("scoring space", menuX+20, menuY+(i+1)*offset+330);
    }
  }
  else {
    var viewchar = tile.character;
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
    templist = [];
  	templist.push("Class: "+viewchar.type);
    templist.push("toHit: "+viewchar.toHit.toFixed(2));
    templist.push("damage: "+viewchar.damage);
    templist.push("Health: "+viewchar.health+"/"+viewchar.maxHealth);
    templist.push("Range: "+viewchar.range);
    templist.push("Critical Chance: " + viewchar.critChance.toFixed(2));
    templist.push("Dodge: "+(viewchar.dodgeChance).toFixed(2) + dstring);
    templist.push("Defense: "+viewchar.defense + defstring);
    if (viewchar.type === "mage") {
      templist.push("Mana: " + viewchar.mana + "/" + maxMana);
    }
    for (var j = 0; j < templist.length; j++) {
      ctx.font="20px Courier New";
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(menuX+10,menuY+(j+1)*offset+310, menuWidth-20, 30);
      ctx.fillStyle = "red";
      ctx.fillText(templist[j], menuX+20, menuY+(j+1)*offset+330);
      
    }
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
				console.log("draw move", movePath);
				if (movePath.length <= 1) {
					animationFlag = false;
				} else {
					animationFlag = false;
				/*	var src = movePath[0].split(",");
					var dest = movePath[1].split(",");
					character.x = src[1]+(dest[1]-src[1]);
					character.x = src[0]+(dest[0]-src[0]);
								
					movePath.splice(0, 1);
				*/}
				
			} else if (playerFocus === "viewing" && animationFlag){
				//draw attack
				console.log("draw attack");
				animationFlag = false;
			}
			ctx.drawImage(character.img, 
				sXList[character.type][0], sYList[character.type][0],
				widthList[character.type][0], heightList[character.type][0],	
				character.x*tileSize, character.y*tileSize,
				tileSize, tileSize);
			p1charList[i] = character;	
		}
		else {
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
	ctx.fillText("[ESC] to return", menuX+20, 500);
	
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
				var instructions = "[space] to select character";
				ctx.font="12px Courier New";
				ctx.fillStyle = "#0FF";
				ctx.fillText(instructions, menuX+20, 200);	
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
		} else if (playerFocus === "playerMenu") {
			menu = playerMenu;
			offset = 100;
		} else if (playerFocus === "attacking") {
			ctx.font="40px Courier New";
			ctx.fillStyle = "#0FF";
			ctx.fillText("Attack!", menuX+20, 200);
		}  	
	}
	else { //turn has ended
		ctx.font="30px Courier New";
		ctx.fillStyle = "#0FF";
		ctx.fillText("Turn Ended!", menuX+20, 300);
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
