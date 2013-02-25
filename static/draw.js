var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function draw() {
	if (gameEndFlag) {
		drawVictory();
		//draw victory banner for p1 or p2
		return; //stop drawing the rest of the crap
	}
	
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawMap();
	//drawCharacters();
	drawCursor();
	drawMenu();
	if (playerFocus === "view stats") {
		displayStats(); //this will be an overlay over the whole map
		//maybe? //or display it anywhere just implement it
	}
	
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
			ctx.drawImage(character.img, character.x * tileSize, character.y * tileSize);
		}
	}
	
	//a bit redundant code but in case we ever have asymmetry between
	//team sizes or whatnot
	//or perhaps coloring character types differently based on team? 
	for (var i = 0; i < p2charList.length; i++) {
		var character = p2charList[i];
		ctx.drawImage(character.img, character.x * tileSize, character.y * tileSize);
	}
}

function drawCursor() {	
	//DRAW CURSOR IMAGE
	ctx.drawImage(cursor, cursor.x*tileSize, cursor.y*tileSize, tileSize, tileSize); 
	
	//POSSIBLY CHANGE CURSOR BASED ON CURRENT ACTIOn
	//SUCH AS ATTACKING OR MOVING OR WHEN HOVERING
	//OVER A CLICKABLE CHARACTER
}

function drawMenu() {
	ctx.fillStyle = "black";
	ctx.fillRect(menuX,menuY,menuWidth,menuHeight);
	
	for (var i = 0; i < menu.length; i++) {
		//draw the menu item
		//menu's items are strings (like "Move")
		if (i === menuIndex) {
			//draw something special for this item
			//like an arrow pointing at it
			//or highlight it or something
		}
	}
}

function displayStats() {
	// blank lawls
}

function drawVictory(){

}
