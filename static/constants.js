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


//ETC ETC