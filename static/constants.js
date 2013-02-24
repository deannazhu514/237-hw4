var tileSize = 12;
var timerDelay = 20;
var key_pressed = {};
var keyPressThreshhold = 5;
var keyPressTickMod = 2;

var map;
var width;
var height;
var p1charList;
var p2charList;
var pointGoal = 100;

var playerNumber;

var menu = [];
var menuIndex;

var pathList;


var playerFocus;

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
var animationFlag;
var gameEndFlag;

/*END FLAGS*/

/*TILE IMAGES HERE*/
var plainImage = new Image();
plainImage.src = "images/plain.png"; //IMAGE SOURCE HERE
var mountainImage = new Image();
mountainImage.src = "images/mountain.png"; //IMAGE SOURCE HERE
var forestImage = new Image();
forestImage.src = "images/forest.png"; //IMAGE SOURCE HERE
var waterImage = new Image();
waterImage.src = "images/water.png";
/*END TILE IMAGES*/

/*CHARACTER IMAGES HERE*/
var warriorImageM = new Image();
warriorImageM.src = "images/human_male.png";
var warriorImageF = new Image();
warriorImageF.src = "images/human_female.png";
var elfImageM = new Image();
elfImageM.src = "images/elf_male.png";
var elfImageF = new Image();
elfImageF.src = "images/elf_female.png";
var zombieImageM = new Image();
zombieImageM.src = "images/zombie_male.png";
var zombieImageF = new Image();
zombieImageF.src = "images/zombie_female.png";
/* END CHARACTER IMAGES*/

/*CURSOR IMAGE*/
var cursor;
//cursor.img = new Image();
//cursor.img.src = "";
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