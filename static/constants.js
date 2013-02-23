var tileSize = 12;
var timerDelay = 20;
var key_pressed = {};
var game;

var playerNumber;

var menu = [];
var menuIndex;

var pathList;

var playerFocus;

var animationFlag;
/*
* possible states include
* -moving
* -attacking
* -viewing (your own turn, view map, can click on characters to control)
* -notTurn (not your turn, view map)
* -any other menu option
*/

var currentChar;
/*FLAGS HERE */
var isDrawingPathFlag;

/*END FLAGS*/

/*TILE IMAGES HERE*/
var plainImage = new Image();
plainImage.src = ""; //IMAGE SOURCE HERE
var mountainImage = new Image();
mountainImage.src = ""; //IMAGE SOURCE HERE
var forestImage = new Image();
forestImage.src = ""; //IMAGE SOURCE HERE
/*END TILE IMAGES*/

/*CHARACTER IMAGES HERE*/
var warriorImage = new Image();
warriorImage.src = "";
/* END CHARACTER IMAGES*/

/*CURSOR IMAGE*/
var cursor;
cursor.img = new Image();
cursor.img.src = "";
/*END CURSOR*/

/*BASE STAT DICTIONARY*/
//ALL STATS ARE THE PRETTY MUCH THE SAME FOR NOW, WHO REALLY CARES ABOUT THIS
var baseStats = {};

baseStats["warrior"] = {
	toHit: .80,
	damage: 10,
	health: 100,
	range: 1,
	defense: 0, 
	movePoints: 5,
	critChance: .05,
	dodgeChance: .07,
	mana: 0
}

baseStats["archer"] = {
	toHit: .80,
	damage: 10,
	health: 100,
	range: 3,
	defense: 0, 
	movePoints: 5,
	critChance: .05,
	dodgeChance: .07,
	mana: 0
}

baseStats["mage"] = {
	toHit: .80,
	damage: 10,
	health: 100,
	range: 1,
	defense: 0, 
	movePoints: 5,
	critChance: .05,
	dodgeChance: .07,
	mana: 100
}

/*END STAT DICTIONARY*/

/*STAT COEFFICIENTS*/
var strDmg = 1;
var strCrit = .03;
var dexHit = .08;
var dexCrit = .03;
var agilMov = .5;
var agilDodge = .05;
var endHP = 12;
var endDef = 0; //NOT SURE YET IF WANT TO INCLUDE DEFENSE AS CORE STAT

/*END COEFFICIENTS*/


//ETC ETC