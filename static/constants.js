var gametitle = "Norbert Wars"

var timerDelay = 20;
var key_pressed = {};
var keyPressThreshhold = 5;
var keyPressTickMod = 2;
var maxMana = 100;

var map;
var canvasWidth = 1100; //0-800 for game, 800-1100 for menu
var canvasHeight = 600;
var tileSize = 50;

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
var magicMenu = [];
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


/* INSTRUCTION TEXT */
var menuText = "Join an open game, create a new game, or continue a saved game. Create a game with your desired map type and wait for a new player to join your game and fight against you. Join a game created by another player. Continue a game against another player that is currently in progress. Any time you quit a game, it will be automatically saved up to the last fully completed turn."

var teamText = "Upon starting a game for the first time, create your team of characters! Choose from a variety of different classes. Warriors are strong melee fighters. Archers are a little more fragile but can attack from a safe range, and are great back line support. Mages are physically weak but are temporarily capable of great power. Clerics have little offensive power, but are capable of restoring health to your characters. Protect them well and you will win the war of attrition."

var gameText = "Every character has a certain number of movepoints to travel across the map. You cannot travel through other characters, enemy or otherwise.  If an enemy is in range, you can attempt to attack them. Your chance to hit is based on your character’s toHit stat and your enemy’s dodge chance. Once you attack, that character’s turn is over even if you have move points remaining. Once all your character’s turns are over, your turn is over and you must wait for your opponent to finish his turn. Your characters are automatically placed on the game map. Different terrain types are harder/easier to move through and while on them you may receive a defensive penalty or bonus."

var terrainText = "TERRAIN: Desert: No modifiers. Valley (low ground): penalty to accuracy, damage, evasion, and protection. Forest: movement penalty, evasion and protection bonus. Mountain: large movement penalty, large evasion and protection bonus"

var winText = "WINNING THE GAME. There are a few “score spots” in the middle of the map. Every turn that you have a character on one of these tiles, you earn a certain number of points. The first to 100 wins! Be careful however, these spots often provide defensive penalties, and another victory condition is simply killing all the enemy units! "

/* ANIMATION */
var movePath = [];
var anim_done = false;
/* END ANIMATION */

var currentChar;

/*FLAGS HERE */
var isDrawingPathFlag;
var animationFlag;
var animation = ""; //"attack", "fireball", "lightning", "victory"
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
/*END TILE IMAGES*/

var graveImg = new Image();
graveImg.src = "images/grave.png";

/*CHARACTER IMAGE CONSTANTS HERE*/
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

var delay = {"warrior":5, 
				"archer":5,
				"mage":5
			};
						
var warriorImage1 = new Image();
warriorImage1.src = "images/human_male.png";
var warriorImage2 = new Image();
warriorImage2.src = "images/human_male2.png";
var archerImage1 = new Image();
archerImage1.src = "images/elf_male.png";
var archerImage2 = new Image();
archerImage2.src = "images/elf_male2.png";
var mageImage1 = new Image();
mageImage1.src = "images/zombie_female.png";
var mageImage2 = new Image();
mageImage2.src = "images/zombie_female2.png";

var warriorImage = [warriorImage1, warriorImage2];
var archerImage = [archerImage1, archerImage2];
var mageImage = [mageImage1, mageImage2];
/* END CHARACTER IMAGE CONSTANTS*/

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

/* MAGIC CONSTANTS */
var spell_x;
var spell_y;
var spell_flag = 0;
var mageSpells = {};
var fireballImg;
fireballImg = new Image();
fireballImg.src = "images/fireball.png";
var fireballsX = [0,30,60];
var fireballsY = [0,30,60,90];
var fireballWidth = 30;
var fireballHeight = 30;

var lightningImg;
lightningImg = new Image();
lightningImg.src = "images/lightning.png";
var lightningsX = [0,30,60];
var lightningsY = [0,30,60,90];
var lightningWidth = 60;
var lightningHeight = 117;


/* END MAGIC CONSTANTS */
