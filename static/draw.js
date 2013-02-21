var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


function draw() {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//note: Assumes width & height = tileSize*map width & height
	for (var i = 0; i < map.height; i++) {
		for (var j = 0; j < map.width; j++) {
			var img = getTileImage(map[i][j]);
			ctx.drawImage(img, j*tileSize, i*tileSize);
		}
	}
	
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
	
	//DRAW CURSOR IMAGE
	ctx.drawImage(cursor.img, cursor.x, cursor.y); 
	
	//POSSIBLY CHANGE CURSOR BASED ON CURRENT ACTIOn
	//SUCH AS ATTACKING OR MOVING OR WHEN HOVERING
	//OVER A CLICKABLE CHARACTER
	
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