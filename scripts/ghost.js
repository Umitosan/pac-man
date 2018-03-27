/*jshint esversion: 6 */

function Ghost(x,y,name,frame0) {
  this.x = x;
  this.y = y;
  this.name = name;
  this.vel = 2.5;
  this.targetX = 'none';
  this.targetY = 'none';
  this.direction = 'right';
  this.moveState = 'chase'; // chase, flee, base, stop, intersection
  this.lastMoveState = 'paused';

  this.intersectionPauseStarted = false;
  this.intersectionPauseBegin = null; // beginning of wait period - performance.now()
  this.intersectionPauseDur = 60; // time to wait at intersection when changing directions

  this.spriteSheet = new Image();
  this.spriteRow = 0;
  this.frame0 = frame0;
  this.curFrame = frame0;
  this.frameTotal = 2;
  this.spriteFrameDur = 150;
  this.spriteFrameWidth = 64;  // in pixels

  this.blinkDur = 30; // milliseconds
  this.blink = false;

  this.tmpPauseState = false;
  this.tmpPauseBegin = null;
  this.tmpPauseDur = 0;

  this.init = function(imgSrc) {
    this.spriteSheet.src = imgSrc;
  };

  this.updateTarget = function() {
    this.targetX = myGame.myPac.x;
    this.targetY = myGame.myPac.y;
  };

  // BLINKY
  this.getNewDirection = function() { // returns new direction based on pac's coords
    // console.log('ghost: get new dir');
    // only allow ghost to turn right or left, no turning back the way he came
    let xDif, yDif;
    if (this.moveState === 'chase') {
      xDif = this.x - myGame.myPac.x;
      yDif = this.y - myGame.myPac.y;
    } else if (this.moveState === 'flee') { // blinky flees to top left corner
      xDif = this.x - State.gridSpacing*1;
      yDif = this.y - State.gridSpacing*1;
    } else {
      console.log('getNewDirection move state prob');
    }
    let newDir = null;
    if ( (this.direction === 'right') || (this.direction === 'left') ) { // get new up or down or straight
        if (yDif < 0) { // ghost below pac: try DOWN>STRAIGHT>UP
          if (this.inBounds('down') === true) { // try down
            newDir = 'down';
          } else if (this.inBounds(this.direction) === true) { // try straight
            newDir = this.direction;
          } else if (this.inBounds('up') === true) { // try up
            newDir = 'up';
          } else {
            console.log("getNewDirection probs");
          }
        } else if (yDif > 0) {  // ghost above pac: try UP>STRAIGHT>DOWN
          if (this.inBounds('up') === true) { // try up
            newDir = 'up';
          } else if (this.inBounds(this.direction) === true) { // try straight
            newDir = this.direction;
          } else if (this.inBounds('down') === true) {
            newDir = 'down';
          } else {
            console.log("getNewDirection probs");
          }
        // pac on same Y as ghost, pick random right turn
      } else if ( (yDif === 0) && (this.inBounds(this.direction) === false) ) { // can't move forward
          newDir = this.getRandomTurnDir();
        } else {
          newDir = this.direction;
          console.log('ghost: getNewDir default dir');
        }
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) { // get new right or left or straight
        if (xDif < 0) { // ghost right of pac: RIGHT>STRAIGHT>LEFT
          if (this.inBounds('right') === true) { // try right
            newDir = 'right';
          } else if (this.inBounds(this.direction) === true) { // try straight
            newDir = this.direction;
          } else if (this.inBounds('left') === true) {
            newDir = 'left';
          } else {
            console.log('ghost: getNewDir default dir');
          }
        } else if (xDif > 0) {  // ghost left of pac: LEFT>STRAIGHT>RIGHT
          if (this.inBounds('left') === true) { // try left
            newDir = 'left';
          } else if (this.inBounds(this.direction) === true) { // try straight
            newDir = this.direction;
          } else if (this.inBounds('right') === true) {
            newDir = 'right';
          } else {
            console.log('ghost: getNewDir default dir');
          }
        // pac on same X as ghost, pick random right turn
        } else if ( (xDif === 0) && (this.inBounds(this.direction) === false) ) { // can't move forward
          newDir = this.getRandomTurnDir();
        } else {
          newDir = this.direction;
          console.log('ghost: getNewDir default dir');
        }
    } else {
      console.log('ghost: getNewDir prob');
    }
    // console.log("ghost: getNewDirection = ", newDir);
    return newDir;
  };

  this.changeDir = function(newDir) {
    console.log('chageDir started');
    this.direction = newDir;
    if (newDir === 'left') {
      this.vel = -Math.abs(this.vel);
    } else if (newDir === 'right') {
      this.vel = Math.abs(this.vel);
    } else if (newDir === 'up') {
      this.vel = -Math.abs(this.vel);
    } else if (newDir === 'down') {
      this.vel = Math.abs(this.vel);
    } else {
      console.log(' changeDir problems ');
    }
    console.log('changeDir to ', this.direction);
  };

  this.getRandomTurnDir = function() {
    let newDir = null;
    let roll = getRandomIntInclusive(0,1);
    if ( (this.direction === 'right') || (this.direction === 'left') ) {
      if (roll === 1) {
        if (this.inBounds('up') === true) {
          newDir = 'up';
        } else if (this.inBounds('down') === true) {
          newDir = 'down';
        } else {
          console.log('cant random any direction');
        }
      } else if (roll === 0)  {
        if (this.inBounds('down') === true) {
          newDir = 'down';
        } else if (this.inBounds('up') === true) {
          newDir = 'up';
        } else {
          console.log('cant random any direction');
        }
      } else {
        console.log('ghost: getRandomTurnDir UD prob');
      }
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      if (roll === 1) {
        if (this.inBounds('right') === true) {
          newDir = 'right';
        } else if (this.inBounds('left') === true) {
          newDir = 'left';
        } else {
          console.log('cant random any direction');
        }
      } else if (roll === 0) {
        if (this.inBounds('left') === true) {
          newDir = 'left';
        } else if (this.inBounds('right') === true) {
          newDir = 'right';
        } else {
          console.log('cant random any direction');
        }
      } else {
        console.log('ghost: getRandomTurnDir LR prob');
      }
    } else {
      console.log('ghost: getRandomTurnDir prob');
    }
    // console.log('rand new turn dir: ', newDir);
    return newDir;
  };

  this.inBounds = function(tDir) {
    var bounds = 'none';
    var sp = State.gridSpacing;
    var off = 10;

    switch (true) {
      case ( (tDir === 'left') && ( getNearestIntersection(this.x-sp+off,this.y).char === "#") ):
        // console.log("LEFT bounds hit ", getNearestIntersection(this.x-sp+off,this.y) );
        bounds = false;  break;
      case ( (tDir === 'right') && ( getNearestIntersection(this.x+sp-off,this.y).char === "#") ):
        // console.log("RIGHT bounds hit ", getNearestIntersection(this.x+sp-off,this.y) );
        bounds = false;  break;
      case ( (tDir === 'up') && ( getNearestIntersection(this.x,this.y-sp+off).char === "#") ):
        // console.log("UP bounds hit ", getNearestIntersection(this.x,this.y-sp+off) );
        bounds = false;  break;
      case ( (tDir === 'down') && (( getNearestIntersection(this.x,this.y+sp-off).char === "#") || ( getNearestIntersection(this.x,this.y+sp-off).char === "W")) ):
        // console.log("DOWN bounds hit ", getNearestIntersection(this.x,this.y+sp-off) );
        bounds = false;  break;
      default:
        bounds = true; break;
    }

    return bounds;
  }; // inBounds

  this.hopToIn = function() {
    let data = getNearestIntersection(this.x,this.y);
    this.x = (data.col+1)*State.gridSpacing;
    this.y = (data.row+1)*State.gridSpacing;
  };

  this.reverseDir = function() {
    let dir = this.direction;
    if (dir === 'right') {
      this.changeDir('left');
    } else if (dir === 'left') {
      this.changeDir('right');
    } else if (dir === 'up') {
      this.changeDir('down');
    } else if (dir === 'down') {
      this.changeDir('up');
    } else {
      console.log('ghost: reverseDir prob');
    }
  };

  this.tmpPause = function(dur) {
    this.tmpPauseState = true;
    this.tmpPauseDur = dur;
    this.tmpPauseBegin = performance.now();
    this.lastMoveState = this.moveState;
    this.moveState = 'paused';
  };

  this.tmpUnpause = function() {
    this.tmpPauseState = false;
    this.tmpPauseDur = 0;
    this.tmpPauseBegin = null;
    this.moveState = this.lastMoveState;
    this.lastMoveState = 'paused';
  };

  this.startFlee = function() {
    console.log('ghost flee started');
    this.moveState = 'flee';
    this.reverseDir();
    this.spriteRow = 1;
    this.frame0 = 0;
    this.currentFrame = 0;
  };

  this.stopFlee = function() {
    console.log('ghost flee stopped');
    this.moveState = 'chase';
    this.reverseDir();
    this.spriteRow = 0;
    this.updateSprite(this.direction);
  };

  this.initEaten = function() {
    // ghost eaten by pac
    // small pause
    // show score txt on game
    // update sprite
    // update goal to inside ghost house
    // update velocity
  };

  this.startBlinking = function() {
    this.frameTotal = 4;
  };

  this.moveGhost = function() {
    let edgeGap = 10;
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      if ((this.x+this.vel) > (CANVAS.width-edgeGap)) {  // handle the TUNNEL
        this.x = edgeGap*2;
      } else if ((this.x+this.vel) < edgeGap) {
        this.x = CANVAS.width-(edgeGap*2);
      } else {
        this.x += this.vel;
      }
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      this.y += this.vel;
    } else {
      console.log(' move ghost problems ');
    }
  }; // move

  this.updateSprite = function(dir) {
    if (dir === 'right') {
      this.frame0 = 2;
      this.curFrame = 2;
    } else if (dir === 'left') {
      this.frame0 = 0;
      this.curFrame = 0;
    } else if (dir === 'up') {
      this.frame0 = 4;
      this.curFrame = 4;
    } else if (dir === 'down') {
      this.frame0 = 6;
      this.curFrame = 6;
    } else {
      console.log('ghost updateSprite probs');
    }
  };

  this.nextFrame = function() { // updates animation frame
    if (this.curFrame < (this.frame0 + this.frameTotal-1)) {
      this.curFrame += 1;
    } else {
      this.curFrame = this.frame0;
    }
  }; // nextFrame

  this.draw = function() {
    // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage( /*image*/   this.spriteSheet,
      /* sx */    (this.curFrame)*(this.spriteFrameWidth), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
      /* sy */    (this.spriteRow)*(this.spriteFrameWidth),
      /*sWidth*/  this.spriteFrameWidth,
      /*sHeight*/ this.spriteFrameWidth,
      /* dx */    this.x-State.gridSpacing+2,
      /* dy */    this.y-State.gridSpacing+2,
      /*dWidth*/  State.gridSpacing*2-6,
      /*dHidth*/  State.gridSpacing*2-6
    );
  };

  this.update = function() {
    if ( (this.moveState === 'chase') && (State.gameStarted = true) ) {
        // if at intersection check which way to go
        if ( atGridIntersection(this.x,this.y,this.vel) ) {
            this.updateTarget();
            let newDir = this.getNewDirection();
            if (newDir !== this.direction) {
              this.changeDir(newDir);
              this.updateSprite(newDir);
              this.hopToIn();
              // pause the ghost's movement for a short duration before continuing
              this.tmpPause(100);
            } else {
              this.moveGhost();
            }
        } else {
          this.moveGhost();
        }
    } else if (this.moveState === 'flee') {  // run to designated corner of screen
        // if at intersection check which way to go
        if ( atGridIntersection(this.x,this.y,this.vel) ) {
            let newDir = this.getNewDirection();
            if (newDir !== this.direction) {
              this.changeDir(newDir);
              this.hopToIn();
              // pause the ghost's movement for a short duration before continuing
              this.tmpPause(100);
            } else {
              this.moveGhost();
            }
        } else {
          this.moveGhost();
        }
    } else if (this.moveState === 'base') {
      // ghost was eaten move to base
    } else if (this.moveState === 'paused') {
          // console.log('ghost stopped');
          // console.log('FIRST dif = ',(performance.now() - this.intersectionPauseBegin) );
          // check to see if it's time to resume movement after an intersection
          if (this.tmpPauseState === true) {
            if ((performance.now() - this.tmpPauseBegin) > this.tmpPauseDur) {
              this.tmpUnpause();
              this.moveGhost();
              this.moveGhost();
            }
          }
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
