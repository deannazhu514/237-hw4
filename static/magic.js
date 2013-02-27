//casts a fireball that does 20 damage to every character in a 3x3 radius centered on x,y
function fireballCast(x,y) {
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var yind = y - 1 + i;
      var xind = x - 1 + j;
      if (yind < 0 || yind > map.height || xind < 0 || xind > map.width) {
        // do nothing
      } else {
        if (map[yind][xind].character !== null) {
          var tempchar = map[yind][xind].character;
          tempchar.health -= mageSpells.fireball.damage;
          if (isDead(tempchar)) {
            map[yind][xind].character = null;
            //display death animation	
          }
        }
      }
    }
  }
}

function lightningCast(x,y) {
  if (map[y][x].character === null) {
    return;
  }
  var tempchar = map[y][x].character;
  tempchar.health -= mageSpells.lightning.damage;
  if (isDead(tempchar)) {
    map[yind][xind].character = null;
    //display death animation	
  }
}

//high area damage, high cost, CAN KILL OWN UNITS
mageSpells.fireball = { cost: 30, 
                        cast: fireballCast, 
                        damage: 30,
                        range: 4,
                        name: "Fireball"
                      };
                      
//unlimited range but weak
mageSpells.lightning = { cost: 20, 
                         cast: lightningCast,
                         damage: 15,
                         range: 2000, //unlimited essentially
                         name: "Lightning Strike"
                       };