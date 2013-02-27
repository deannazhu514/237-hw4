var gametitle = "Norbert Wars"

var timerDelay = 20;
var key_pressed = {};
var keyPressThreshhold = 5;
var keyPressTickMod = 2;

var map;
var canvasWidth = 1100; //0-800 for game, 800-1100 for menu
var canvasHeight = 600;
var tileSize = 60;

var width = Math.floor((canvasWidth-300)/tileSize);
var height = Math.floor(canvasHeight/tileSize);
var p1charList;
var p2charList;
var pointGoal = 100;

var playerNumber;

/* MENU CONSTANTS */
var menuWidth = 300;
var menuHeight = canvasHeight;
var menuX = canvasWidth-menuWidth;
var menuY = 0;

var menu = []; //don't know if this is needed

var characterMenu = [];
var playerMenu = [];
var statMenu = [];
var menuIndex = 0;
/*END MENU CONSTANTS*/

/* GAMEPLAY VARIABLES */
var listPath = [];
var hit = false;
var attacked = false;
var damage = -1;
var turnEnd = false;

/*END GAMEPLAY VARIABLES*/

var pointGain = 20;

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

/*TILE CONSTANTS*/
var tileType = ["plain", "mountain", "forest"];
/*END TILE CONSTANTS*/

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

var graveImg = new Image();
graveImg.src = "images/grave.png";

/*CHARACTER CONSTANTS HERE*/

var sXList = {"warrior":[0, 30, 60], 
				"archer":[0, 30, 55], 
				"mage":[0, 30, 60]
			};
var sYList = {"warrior":[0,35,70,105], 
				"archer":[0,45,85,125],
				"mage":[0,35,70,105]
			};
var widthList = {"warrior":[30,30,30], 
				"archer":[25,25,25],
				"mage":[30,30,30]
			};
var heightList = {"warrior":[34,34,34,34], 
				"archer":[43,40,40,43],
				"mage":[33,33,33,33]
			};
var index = {"warrior":0, 
				"archer":0,
				"mage":0
			};

var warriorImageM = new Image();
warriorImageM.src = "images/human_male.png";
var warriorImageF = new Image();
warriorImageF.src = "images/human_female.png";

var archerImageM = new Image();
archerImageM.src = "images/elf_male.png";

var archerImageF = new Image();
archerImageF.src = "images/elf_female.png";

var mageImageM = new Image();
mageImageM.src = "images/zombie_female.png";

var mageImageF = new Image();
mageImageF.src = "images/zombie_male.png";

/* END CHARACTER CONSTANTS*/

/*CURSOR IMAGE*/
var cursorImg;
cursorImg = new Image();
cursorImg.src = "images/cursor.png";
var cursor={};
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

var classStats = {};
// the base stats that the player will see when making characters
// base, min, max
classStats["warrior"] = {
	"strength": [8, 1, 10],
	"dexterity": [2, 1, 5],
	"endurance": [8, 1, 10],
	"agility": [2, 1, 5]
}
classStats["archer"] = {
	"strength": [3, 1, 5],
	"dexterity": [8, 1, 10],
	"endurance": [5, 1, 8],
	"agility": [8, 1, 10]
}
classStats["mage"] = {
	"strength": [8, 1, 10],
	"dexterity": [5, 1, 10],
	"endurance": [3, 1, 5],
	"agility": [3, 1, 5]
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