/*jshint esversion: 6 */

function Ghost(x,y,name) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.velocity = 2;
  this.targetX = 'none';
  this.targetY = 'none';
  this.direction = 'right';
  this.moveState = 'chase'; // chase, flee, base, stop

  this.spriteSheet = new Image();
  this.curFrame = 3;
  this.spriteFrameDur = 150;
  this.spriteFrameWidth = 64;  // in pixels

  this.init = function(imgSrc) {
    this.spriteSheet.src = imgSrc;
  };

  // this.checkSides = function() {
  //   let sides = null;
  //   if (this.inBounds(this.direction) === false) {
  //     sides = 'none';
  //   } else {
  //     sides = 'F';
  //   }
  //   return sides;
  // };

  this.getNewDirection = function() {
    // if () {
    //
    // } else if {
    //
    // } else if {
    //
    // } else {
    //
    // }
  };

  this.inBounds = function(tDir) {
    var bounds = 'none';
    var sp = State.gridSpacing;
    var off = 10;

    switch (true) {
      case ( (tDir === 'left') && ( getNearestIntersection(this.x-sp+off,this.y).char === "#") ):
        console.log("LEFT bounds hit ", getNearestIntersection(this.x-sp+off,this.y) );
        bounds = false;  break;
      case ( (tDir === 'right') && ( getNearestIntersection(this.x+sp-off,this.y).char === "#") ):
        console.log("RIGHT bounds hit ", getNearestIntersection(this.x+sp-off,this.y) );
        bounds = false;  break;
      case ( (tDir === 'up') && ( getNearestIntersection(this.x,this.y-sp+off).char === "#") ):
        console.log("UP bounds hit ", getNearestIntersection(this.x,this.y-sp+off) );
        bounds = false;  break;
      case ( (tDir === 'down') && (( getNearestIntersection(this.x,this.y+sp-off).char === "#") || ( getNearestIntersection(this.x,this.y+sp-off).char === "W")) ):
        console.log("DOWN bounds hit ", getNearestIntersection(this.x,this.y+sp-off) );
        bounds = false;  break;
      default:
        // console.log('no bounds hit, keep going fwd');
        bounds = true; break;
    }

    return bounds;
  }; // inBounds

  this.nextFrame = function() {
    if (this.curFrame === 3) {
      this.curFrame = 4;
    } else if (this.curFrame === 4) {
      this.curFrame = 3;
    } else {
      console.log('ghost nextFrame problmes');
    }
  }; // nextFrame

  this.moveGhost = function() {
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      this.x += this.velocity;
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      this.y += this.vel;
    } else {
      console.log(' move ghost problems ');
    }
  }; // move

  this.draw = function() {
    // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage( /*image*/   this.spriteSheet,
                   /* sx */    (this.curFrame-1)*(this.spriteFrameWidth), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
                   /* sy */    0,
                   /*sWidth*/  this.spriteFrameWidth,
                   /*sHeight*/ this.spriteFrameWidth,
                   /* dx */    this.x-State.gridSpacing+2,
                   /* dy */    this.y-State.gridSpacing+3,
                   /*dWidth*/  State.gridSpacing*2-4,
                   /*dHidth*/  State.gridSpacing*2-4
                );
  };

  this.update = function() {
    // move to intersection
    // find best direction
    // try left, forward, right  (the order depends on targetX and targetY)
    //  always prefer going in a direction that will reduce the distance to targetX or targetY
    //    maybe add randomization when 2 options are equally good
    // set new direction
    if ( (this.moveState === 'chase') && (myGame.myPac.moveState === 'go') ) {
        // if at intersection check which way to go
        if ( atGridIntersection(this.x,this.y) ) {
          if (this.inBounds(this.direction) === false) {
            this.moveState = 'stop';
            console.log('ghost stopped');
            this.getNewDirection();
          } else {
            this.moveGhost();
          }
        } else {
          this.moveGhost();
        }

    } else if (this.moveState === 'flee') {
      // run to designated corner of screen
    } else if (this.moveState === 'base') {
      // ghost was eaten move to base
    } else if (this.moveState === 'stop') {
      // nothin
    } else {
      // nothin
    }
    // update the animation frame
    if ((State.playTime % this.spriteFrameDur) < 17) { this.nextFrame(); }
  }; // update

} // GHOST

// Ghost personality overview
//
// info from https://www.youtube.com/watch?v=l7-SHTktjJc
//
// CHARACTER  /  NICKNAME
// SHADOW aka "BLINKY" - RED - goes straight for PacMan always
//                           - he gets slightly faster over time (per level?) known as "Cruise Elroy"
//                           - this is based directly on number of dots eaten (depends on lvl playing)
//                           - stops being cruise elroy when pac dies
//
// SPEEDY aka "PINKY" - PINK - japanese word for him translates to 'chaser'
//                           - he tries to land on the tile 2 tiles from pacman like and ambush
//                           - old glitch: if pac facing up... tries to land on tile 4 in front and 4 to the left of pac
//
// BASHFUL aka "INKY" - AUQA - determined my 2 things: relative position of pacman and blinky
//                            - targets tile 2 ahead of pacman and doubling the distance Blinky is away from it
//                            - also glitched... if pac facing up target tile is 2 ahead of pac and 2 to the left
//                            - Japanese name is "kimagure" - 'fickle'
// POKEY aka "CLYDE" -  YELLOW - movments based on distance to PacMan
//                             - when 8 tiles or less away from BLINKY.. he moves like BLINKY (moves straight for pacman)
//                             - when within 8 tiles of PACMAN.. he flees to the bottom left portion of screen
//                             - Japanese name "otoboke" - 'feining ignorance'
//
// EVERY GHOST - has 3 MODES    1. Chase - normal as described above
//                              2. Scatter - after a few seconds of gameplay depending on current level, they 'flee' to a different corner of the map
//                                         - BLINKY - top right
//                                         - PINKY - top left
//                                         - INKY - bottom right
//                                         - CLYDE - bottom left
//                                         - they enter the scatter mode a max of 4 TIMES per pac life or lvl
//                                         - if scatter is done.. they will CHASE forever
//                                3. Freighten - all turn blue and run away
//                                             - all reverse direction
//                                             - at corner psuedo random direction is chosen
//                                             -
//                                             -
//  there are some SAFE ZONES in some levels where pac and go and never be attacked
//
//  PACMAN always turns corners INSTANTLY vs GHOSTS which pause for just a moment at each intersection
//  Ghosts MOVE SLOWER in tunnel
//
//  level start - INKY-PINKY-CLYDE are in the ghost house at the beginning - two side facing up and PINKY facing down
//              - only BLINKY is outside and facing left
//              - READY! in the middle of the screen
