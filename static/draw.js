var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function drawMap() {
	//note: Assumes canvas width & height >= tileSize*map's width & height
	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			var img = getTileImage(map[i][j]);
			ctx.drawImage(img, j*tileSize, i*tileSize);
		}
	}
}

function drawCharacters() {
	for (var i = 0; i < p1charList.length; i++) {
		var character = p1charList[i];
		ctx.drawImage(character.img, character.x * tileSize, character.y * tileSize);
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
	ctx.drawImage(cursor.img, cursor.x*tileSize, cursor.y*tileSize); 
	
	//POSSIBLY CHANGE CURSOR BASED ON CURRENT ACTIOn
	//SUCH AS ATTACKING OR MOVING OR WHEN HOVERING
	//OVER A CLICKABLE CHARACTER
}

function drawMenu() {
	ctx.drawRect(width*tileSize, 0, canvas.width -(width * tileSize), canvas.height); //menu box
	
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

function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawMap();
	drawCharacters();
	drawCursor();
	drawMenu();
	if (playerFocus === "view stats") {
		displayStats(); //this will be an overlay over the whole map
	}
	
}

function displayStats() {
	var character = currentChar;
	//draw a rectangle over map
	
	//draw the character's stats
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