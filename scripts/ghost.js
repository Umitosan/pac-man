/*jshint esversion: 6 */

function Ghost(x,y,name,src,frame0,mvState,dir,dots,allow) {
  // general
  this.startPosX = x;
  this.startPosY = y;
  this.x = x;
  this.y = y;
  this.name = name;
  this.bodyColor = undefined;
  this.spriteImgSrc = src;
  this.vel = 2.7;
  this.chaseVel = 2.7;
  this.baseVel = 4.5;
  this.fleeVel = 2.2;
  this.exitBaseVel = 1.5;
  this.tunnelVel = 1.8;
  this.targetX = 'none';
  this.targetY = 'none';
  this.direction = dir;
  this.moveState = mvState; // chillbase, exitbase, chase, flee(aka frightened), scatter, base, tpaused, stop, gameover
  this.lastMoveState = 'tpaused';
  this.eatenTxtBox = undefined;
  this.chillCoef = 1;
  this.prevInter = null; // used to prevent changing dir 2 times at same interseciton when chasing
  this.dotLimit = dots; // number of dots to be eaten by pac before this ghost exits the base from start  // SEE pac.tryEatPill for mechanics
  this.dotCounter = 0; // when in base and when ghost is next in line to exit, count goes up as pac eats
  this.dotsEatenSwitch = allow;  // SEE pac.tryEatPill for mechanics

  // sprite stuff
  this.spriteSheet = new Image();
  this.spriteRow = 0;
  this.frame0 = frame0;
  this.curFrame = frame0;
  this.frameTotal = 2;
  this.spriteFrameDur = 150;
  this.spriteFrameWidth = 64;  // in pixels

  // ghost pause
  this.timedPauseState = false;
  this.timedPauseBegin = null;
  this.timedPauseDur = 0;

} // GHOST

Ghost.prototype.init = function() {
  let spacing = State.gridSpacing;
  getGhostChangeTarget(this.name);
  this.spriteSheet.src = this.spriteImgSrc;
  if (this.name === 'blinky') {
    this.startChase();
    this.x = spacing*14+(spacing/2);
  } else {
    if (this.name !== 'pinky') { this.vel = 1; } // vel 1 for chillbase state
    this.targetX = spacing*14+(spacing/2);
    this.targetY = spacing*12;
    this.changeDir(this.direction);
    this.updateSprite(this.direction);
  }
  switch (this.name) {
    case "blinky":
      this.bodyColor = Colors.ghostRed;
      break;
    case "pinky":
      this.bodyColor = Colors.ghostPink;
      break;
    case "inky":
      this.bodyColor = Colors.ghostAqua;
      break;
    case "clyde":
      this.bodyColor = Colors.ghostOrange;
      break;
    default:
      if (LOGS) console.log('didnt find ghost color');
      break;
  }
  this.timedPause(2000);
}; // init

Ghost.prototype.softReset = function() { // reset ghosts to original values
  // reset positions
  this.x = this.startPosX;
  this.y = this.startPosY;
  // reset sprites
  this.spriteRow = 0;
  this.frame0 = 2;
  this.curFrame = 2;
  this.frameTotal = 2;

  this.lastMoveState = 'tpaused';

  if (this.name === 'blinky') {
    this.moveState = 'chase';
    this.changeDir('left');
    this.updateSprite('left');
  } else if ( (this.name === 'inky') || (this.name === 'clyde') ) {
    this.moveState = 'chillbase';
    this.vel = 1; // chillbase speed
    this.changeDir('down');
    this.updateSprite('down');
  } else if (this.name === 'pinky') {
    this.startExitBase();
  } else {
    if (LOGS) console.log('ghost soft reset probs');
  }
  this.timedPause(2000);
};  // softReset

Ghost.prototype.nextChillAnim = function() {
  let spacing = State.gridSpacing;
  if (this.y <= ((spacing*15)-12)) {
    this.chillCoef = 1;
    this.y += (this.vel*this.chillCoef);
    this.direction = 'down';
    this.updateSprite(this.direction);
  } else if (this.y >= ((spacing*15)+12)) {
    this.chillCoef = -1;
    this.y += (this.vel*this.chillCoef);
    this.direction = 'up';
    this.updateSprite(this.direction);
  } else { // move in same dir
    this.y += (this.vel*this.chillCoef);
  }
}; // nextChillAnim

Ghost.prototype.inTunnel = function() {
  let spacing = State.gridSpacing;
  let tBool;
  if (this.y === (spacing*15)) {
    if ((this.x < (spacing*5)) || (this.x > (spacing*24)))  {
      tBool = true;
    } else {
      tBool = false;
    }
  } else {
    tBool = false;
  }
  return tBool;
};

Ghost.prototype.changeTarget = function() {
  // to be filled at this.init()
  // defined specifically for each ghost at getGhostChangeTarget()
};

Ghost.prototype.nearPac = function() {
  // for clyde only
};

Ghost.prototype.try3Dirs = function(dir1,dir2,dir3) { // tests 3 directions inBounds and returns first good one
  let someDir;
  if (this.inBounds(dir1) === true) {
    someDir = dir1;
  } else if (this.inBounds(dir2) === true) {
    someDir = dir2;
  } else if (this.inBounds(dir3) === true) {
    someDir = dir3;
  } else {
    someDir = undefined;
    if (LOGS) console.log('ghost: tryDir prob');
  }
  return someDir;
}; // try3Dirs

Ghost.prototype.getNewDirection = function() { // returns new direction based on target's coords
  let xDif, yDif;
  let newDir = null;

  this.changeTarget();
  xDif = this.x - this.targetX;
  yDif = this.y - this.targetY;

  if (this.direction === 'right') {
    // go straight if ideal, else go ideal Y dir, else turn random, else straight
    if (Math.abs(xDif) >= Math.abs(yDif)) {
            if ( (xDif < 0) && (this.inBounds(this.direction) === true) ) { // try go right if ideal
              newDir = this.direction;
            } else { // get best up or down or straight
                if (yDif < 0) { // try down, stright, up
                    newDir = this.try3Dirs('down',this.direction,'up');
                } else if (yDif > 0) { // try up, stright, down
                    newDir = this.try3Dirs('up',this.direction,'down');
                } else if (yDif === 0) { // try straight, up, down (this maybe should be random up or down)
                    newDir = this.try3Dirs(this.direction,'up','down');
                } else { // try straight, up, down (this maybe should be random up or down)
                    newDir = this.try3Dirs(this.direction,'up','down');
                }
            }
    } else if (Math.abs(yDif) > Math.abs(xDif)) {
            if (yDif < 0) { // try down straight up
                newDir = newDir = this.try3Dirs('down',this.direction,'up');
            } else if (yDif > 0) { // try up straight down
              newDir = newDir = this.try3Dirs('up',this.direction,'down');
            } else { // try straight up down (this maybe should be random up down)
              newDir = newDir = this.try3Dirs(this.direction,'up','down');
            }
    } else {
      if (LOGS) console.log('ghost: getNewDir right prob');
    }
  } else if (this.direction === 'left') {
          if (Math.abs(xDif) >= Math.abs(yDif)) {
            if ( (xDif > 0) && (this.inBounds(this.direction) === true) ) { // try go left if ideal
              newDir = this.direction;
            } else { // get best up or down or straight
                if (yDif < 0) {  // try down, stright, up
                    newDir = this.try3Dirs('down',this.direction,'up');
                } else if (yDif > 0) { // try up, stright, down
                    newDir = this.try3Dirs('up',this.direction,'down');
                } else if (yDif === 0) { // try straight, up, down (this maybe should be random up or down)
                   newDir = this.try3Dirs(this.direction,'up','down');
                } else { // try straight, up, down (this maybe should be random up or down)
                    newDir = this.try3Dirs(this.direction,'up','down');
                }
            }
    } else if (Math.abs(yDif) > Math.abs(xDif)) {
            if (yDif < 0) { // try down straight up
                newDir = newDir = this.try3Dirs('down',this.direction,'up');
            } else if (yDif > 0) { // try up straight down
              newDir = newDir = this.try3Dirs('up',this.direction,'down');
            } else { // try straight up down (this maybe should be random up down)
              newDir = newDir = this.try3Dirs(this.direction,'up','down');
            }
    } else {
      if (LOGS) console.log('ghost: getNewDir left prob');
    }
  } else if (this.direction === 'up') {
    if (Math.abs(yDif) >= Math.abs(xDif)) { // ghost wants to move in Y dir
            if ( (yDif > 0) && (this.inBounds(this.direction) === true) ) { // try go up if ideal
              newDir = this.direction;
            } else { // get best right or left or straight
                if (xDif < 0) { // try right, straight, left
                    newDir = this.try3Dirs('right',this.direction,'left');
                } else if (xDif > 0) {  // try left, striaght, right
                    newDir = this.try3Dirs('left',this.direction,'right');
                } else if (xDif === 0) { // try straight, left, right (this maybe should be random left right)
                    newDir = this.try3Dirs(this.direction,'left','right');
                } else { // try straight, left,right (this maybe should be random left right)
                    newDir = this.try3Dirs(this.direction,'left','right');
                }
            }
    } else if (Math.abs(xDif) > Math.abs(yDif)) { // ghost wants to move in X dir
            if (xDif < 0) { // try right straight left
              newDir = newDir = this.try3Dirs('right',this.direction,'left');
            } else if (xDif > 0) { // try left straight right
              newDir = newDir = this.try3Dirs('left',this.direction,'right');
            } else { // try straight left right (this maybe should be random left right)
              newDir = this.try3Dirs(this.direction,'left','right');
            }
    } else {
      if (LOGS) console.log('ghost: getNewDir left prob');
    }
  } else if (this.direction === 'down') {
    if (Math.abs(yDif) >= Math.abs(xDif)) {
            if ( (yDif < 0) && (this.inBounds(this.direction) === true) ) { // try go down if ideal
              newDir = this.direction;
              // if (LOGS) console.log('ghost SAME DIR');
            } else { // get best right or left or straight
                if (xDif < 0) { // try right, straight, left
                    newDir = this.try3Dirs('right',this.direction,'left');
                } else if (xDif > 0) {  // try left, striaght, right
                    newDir = this.try3Dirs('left',this.direction,'right');
                } else if (xDif === 0) { // try straight, left,right (this maybe should be random left right)
                    newDir = this.try3Dirs(this.direction,'left','right');
                } else { // try straight, left,right (this maybe should be random left right)
                    newDir = this.try3Dirs(this.direction,'left','right');
                }
            }
    } else if (Math.abs(xDif) > Math.abs(yDif)) {
            if (xDif < 0) { // try right straight left
              newDir = newDir = this.try3Dirs('right',this.direction,'left');
            } else if (xDif > 0) { // try left straight right
              newDir = newDir = this.try3Dirs('left',this.direction,'right');
            } else { // try straight left right (this maybe should be random left right)
              newDir = this.try3Dirs(this.direction,'left','right');
            }
    } else {
      if (LOGS) console.log('ghost: getNewDir left prob');
    }
  } else {
    if (LOGS) console.log('ghost: getNewDirection prob' );
  }
  return newDir;
};  // getNewDirection

Ghost.prototype.changeDir = function(newDir) { // updates dir and updates vel
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
    if (LOGS) console.log(' changeDir problems ');
  }
};  // changeDir

Ghost.prototype.changeVel = function(newVel) { // updates to new vel
  let dir = this.direction;
  if (dir === 'left') {
    this.vel = -Math.abs(newVel);
  } else if (dir === 'right') {
    this.vel = Math.abs(newVel);
  } else if (dir === 'up') {
    this.vel = -Math.abs(newVel);
  } else if (dir === 'down') {
    this.vel = Math.abs(newVel);
  } else {
    if (LOGS) console.log(' changeVel problems ');
  }
};

Ghost.prototype.getRandomTurnDir = function() {
  let newDir = null;
  let roll = getRandomIntInclusive(0,1);
  if ( (this.direction === 'right') || (this.direction === 'left') ) {
    if (roll === 1) {
      if (this.inBounds('up') === true) {
        newDir = 'up';
      } else if (this.inBounds('down') === true) {
        newDir = 'down';
      } else {
        if (LOGS) console.log('cant random any direction');
      }
    } else if (roll === 0)  {
      if (this.inBounds('down') === true) {
        newDir = 'down';
      } else if (this.inBounds('up') === true) {
        newDir = 'up';
      } else {
        if (LOGS) console.log('cant random any direction');
      }
    } else {
      if (LOGS) console.log('ghost: getRandomTurnDir UD prob');
    }
  } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
    if (roll === 1) {
      if (this.inBounds('right') === true) {
        newDir = 'right';
      } else if (this.inBounds('left') === true) {
        newDir = 'left';
      } else {
        if (LOGS) console.log('cant random any direction');
      }
    } else if (roll === 0) {
      if (this.inBounds('left') === true) {
        newDir = 'left';
      } else if (this.inBounds('right') === true) {
        newDir = 'right';
      } else {
        if (LOGS) console.log('cant random any direction');
      }
    } else {
      if (LOGS) console.log('ghost: getRandomTurnDir LR prob');
    }
  } else {
    if (LOGS) console.log('ghost: getRandomTurnDir prob');
  }
  return newDir;
};  // getRandomTurnDir

Ghost.prototype.inBounds = function(tDir) {
  let bounds = 'none';
  let spacing = State.gridSpacing;
  let off = this.vel;

  switch (true) {
    case ( (tDir === 'left') && ( getNearestIntersection(this.x-spacing+off,this.y).char === "#") ):
      // if (LOGS) console.log("LEFT bounds hit ", getNearestIntersection(this.x-spacing+off,this.y) );
      bounds = false;  break;
    case ( (tDir === 'right') && ( getNearestIntersection(this.x+spacing-off,this.y).char === "#") ):
      // if (LOGS) console.log("RIGHT bounds hit ", getNearestIntersection(this.x+spacing-off,this.y) );
      bounds = false;  break;
    case ( (tDir === 'up') && ( getNearestIntersection(this.x,this.y-spacing+off).char === "#") ):
      // if (LOGS) console.log("UP bounds hit ", getNearestIntersection(this.x,this.y-spacing+off) );
      bounds = false;  break;
    case ( (tDir === 'down') && ( getNearestIntersection(this.x,this.y+spacing-off).char === "#") ):
      // if (LOGS) console.log("DOWN bounds hit ", getNearestIntersection(this.x,this.y+spacing-off) );
      bounds = false;  break;
    case ( (tDir === 'down') && ( getNearestIntersection(this.x,this.y+spacing-off).char === "W") && (this.moveState !== 'base') ):
      // let the ghost go into the base to reset after being eaten
      bounds = false;  break;
    default:
      bounds = true; break;
  }
  return bounds;
}; // inBounds

Ghost.prototype.hopToIn = function() {
  let data = getNearestIntersection(this.x,this.y);
  this.x = (data.col+1)*State.gridSpacing;
  this.y = (data.row+1)*State.gridSpacing;
};

Ghost.prototype.tryReverseDir = function() {
  let dir = this.direction;
  if (dir === 'right') {
    if (this.inBounds('left') === true) {
      this.changeDir('left');
    } else {  // edge case: right after making 90 degree turn, ghost tried to reverse direction
      if (LOGS) console.log(this.name+' tryReverse but cant go... left');
      if (LOGS) console.log('dir = ', dir);
      // State.myGame.pauseIt();
      let newDir = this.try3Dirs('up','down','left');
      this.changeDir(newDir);
      this.hopToIn();
      if (LOGS) console.log(this.name+' now going '+newDir);
    }
  } else if (dir === 'left') {
    if (this.inBounds('right') === true) {
      this.changeDir('right');
    } else {  // edge case: right after making 90 degree turn, ghost tried to reverse direction
      if (LOGS) console.log(this.name+' tryReverse but cant go... right');
      if (LOGS) console.log('dir = ', dir);
      // State.myGame.pauseIt();
      let newDir = this.try3Dirs('up','down','right');
      this.changeDir(newDir);
      this.hopToIn();
      if (LOGS) console.log(this.name+' now going '+newDir);
    }
  } else if (dir === 'up') {
    if (this.inBounds('down') === true) {
      this.changeDir('down');
    } else {  // edge case: right after making 90 degree turn, ghost tried to reverse direction
      if (LOGS) console.log(this.name+' tryReverse but cant go... down');
      if (LOGS) console.log('dir = ', dir);
      // State.myGame.pauseIt();
      let newDir = this.try3Dirs('left','right','down');
      this.changeDir(newDir);
      this.hopToIn();
      if (LOGS) console.log(this.name+' now going '+newDir);
    }
  } else if (dir === 'down') {
    if (this.inBounds('up') === true) {
      this.changeDir('up');
    } else {  // edge case: right after making 90 degree turn, ghost tried to reverse direction
      if (LOGS) console.log(this.name+' tryReverse but cant go... up');
      if (LOGS) console.log('dir = ', dir);
      // State.myGame.pauseIt();
      let newDir = this.try3Dirs('left','right','up');
      this.changeDir(newDir);
      this.hopToIn();
      if (LOGS) console.log(this.name+' now going '+newDir);
    }
  } else {
    if (LOGS) console.log(this.name+' reverseDir prob');
  }
}; // tryReverseDir

Ghost.prototype.timedPause = function(dur) {
  this.timedPauseState = true;
  this.timedPauseDur = dur;
  this.timedPauseBegin = performance.now();
  if (this.moveState === 'tpaused') { // edge case that makes both last and current move state the same: 'tPaused'
    // want this.lastMoveState to stay the same, otherwise we lose that information
  } else {  //
    this.lastMoveState = this.moveState;
  }
  this.moveState = 'tpaused';
};  // timedPause

Ghost.prototype.tmpUnpause = function() {
  this.timedPauseState = false;
  this.timedPauseDur = 0;
  this.timedPauseBegin = null;
  this.moveState = this.lastMoveState;
  this.lastMoveState = 'tpaused';
};

Ghost.prototype.startBlinking = function() {
  if ( (this.moveState === 'flee') || ( (this.moveState === 'tpaused') && (this.lastMoveState === 'flee')) ) {
    // if (LOGS) console.log(this.name+' started blinking');
    this.frameTotal = 4;
  }
};

Ghost.prototype.stopBlinking = function() {
  if ( (this.moveState === 'flee') || ( (this.moveState === 'tpaused') && (this.lastMoveState === 'flee')) ) {
    // if (LOGS) console.log(this.name+' STOP BLINKING');
    this.frameTotal = 2;
    this.spriteRow = 1;
    this.frame0 = 0;
    this.curFrame = 0;
  }
};

Ghost.prototype.tryStartFlee = function() {
  if ( (this.moveState === 'flee') || ( (this.moveState === 'tpaused') && (this.lastMoveState === 'flee')) ) {
    // if (LOGS) console.log(this.name+' already fleeing, stop blining');
    this.stopBlinking();
  } else if ( (this.moveState === 'chase') ||
              ((this.moveState === 'tpaused') && (this.lastMoveState === 'chase')) ||
              (this.moveState === 'scatter') ||
              ((this.moveState === 'tpaused') && (this.lastMoveState === 'scatter')) ) {
    // if (LOGS) console.log(this.name+' flee started');
    this.lastMoveState = this.moveState;
    this.moveState = 'flee';
    this.tryReverseDir();
    this.prevInter = getNearestIntersection(this.x,this.y);
    this.spriteRow = 1;
    this.frame0 = 0;
    this.curFrame = 0;
    this.changeVel(this.fleeVel);
  } else {
    // wrong state so nothin
  }
};  // tryStartFlee

Ghost.prototype.stopFlee = function() {
  // if (LOGS) console.log(this.name+' stop flee run');
  if ( (this.moveState === 'flee') || ( (this.moveState === 'tpaused') && (this.lastMoveState === 'flee')) ) {
    // if (LOGS) console.log('ghost flee stopped');
    this.moveState = 'chase';
    this.spriteRow = 0;
    this.frameTotal = 2;
    this.changeVel(this.chaseVel);
    this.updateSprite(this.direction);
  } else {
    // not ready to switch states
  }
}; // stopFlee

Ghost.prototype.tryStartScatter = function() {
  // if (LOGS) console.log(this.name + " moveState = "+ this.moveState );
  // if (LOGS) console.log(this.name + " lastMoveState = "+ this.lastMoveState );
   if ( (this.moveState === 'chase') || ((this.moveState === 'tpaused') && (this.lastMoveState === 'chase')) ) {
    // if (LOGS) console.log(this.name + ': START scatter');
    this.lastMoveState = this.moveState;
    this.moveState = 'scatter';
    this.tryReverseDir();
    this.prevInter = getNearestIntersection(this.x,this.y);
    this.spriteRow = 0;
    this.frameTotal = 2;
    this.updateSprite(this.direction);
  } else {
    // wrong state so nothin
  }
};  // tryStartScatter

Ghost.prototype.tryStopScatter = function() {
  if ( (this.moveState === 'scatter') || ( (this.moveState === 'tpaused') && (this.lastMoveState === 'scatter')) ) {
    // if (LOGS) console.log(this.name + ': STOPED scatter');
    this.moveState = 'chase';
    this.spriteRow = 0;
    this.frameTotal = 2;
    this.changeVel(this.chaseVel);
    this.updateSprite(this.direction);
  } else {
    // if (LOGS) console.log(this.name + ': tried but didnt need to stop scatter');
    // not ready to switch states
  }
};  // tryStopScatter

Ghost.prototype.updateDotsCounter = function() {  // check if inky and clyde are allowed to leave the base yet
  if (this.moveState === 'chillbase') {
    if (this.name === 'inky') {
      this.dotCounter += 1;
      if (this.dotCounter === this.dotLimit) {
        // if (LOGS) console.log(this.name+" is now allowed to leave base");
        this.dotsEatenSwitch = true;
        this.startExitBase();
      }
    } else if ( (this.name === 'clyde') && (State.myGame.ghosts[2].dotsEatenSwitch === true) ) {
      this.dotCounter += 1;
      if (this.dotCounter === this.dotLimit) {
        // if (LOGS) console.log(this.name+" is now allowed to leave base");
        this.dotsEatenSwitch = true;
        this.startExitBase();
      }
    } else {
      // nothin
    }
  }


  // if ( (State.myGame.ghosts[2].dotsEatenSwitch === false) && (curDots === (244 - State.myGame.ghosts[2].dotLimit)) ) {
  //   if (LOGS) console.log(State.myGame.ghosts[2].name+" is now allowed to leave base");
  //   State.myGame.ghosts[2].dotsEatenSwitch = true;
  //   State.myGame.ghosts[2].startExitBase();
  // }
  // if ( (State.myGame.ghosts[3].dotsEatenSwitch === false) && (curDots === (244 - State.myGame.ghosts[3].dotLimit)) ) {
  //   if (LOGS) console.log(State.myGame.ghosts[3].name+" is now allowed to leave base");
  //   State.myGame.ghosts[3].dotsEatenSwitch = true;
  //   State.myGame.ghosts[3].startExitBase();
  // }
};  // updateDotsCounter

Ghost.prototype.startExitBase = function() { // after returning to base, reset state to exitbase etc
  // if (LOGS) console.log(this.name+" started to exit base");
  this.moveState = 'exitbase';
  this.changeTarget();
  this.vel = this.exitBaseVel;
  this.spriteRow = 0;
  this.frameTotal = 2;
  if ( (this.name === 'blinky') || (this.name === 'pinky') ) {
    this.changeDir('up');
    this.updateSprite('up');
  } else if (this.name === 'inky') {
    this.changeDir('right');
    this.updateSprite('right');
    this.dotCounter = 0;
  } else if (this.name === 'clyde') {
    this.changeDir('left');
    this.updateSprite('left');
    this.dotCounter = 0;
  } else {
    // nothin
  }
};  // startExitBase

Ghost.prototype.startChase = function() {
  this.prevInter = getNearestIntersection(this.x,this.y); // set initial prevInter at start of chase
  this.y = State.gridSpacing*12;  // this is an alternative to hopToIn in order to snap to the
  if (State.myGame.scatterOn === true) {
    this.moveState = 'scatter';
  } else {
    this.moveState = 'chase';
  }
  this.changeVel(this.chaseVel);
  this.spriteRow = 0;
  let newDir = this.getNewDirection();
  this.changeDir(newDir);
  this.updateSprite(newDir);
};  // startChase

Ghost.prototype.initEaten = function() {
  // stop fleeing
  // ghost eaten by pac
  // small pause
  // update sprite
  // update ghost goal to inside ghost house
  // update velocity
  // show score txt on game
  this.stopFlee();
  this.spriteRow = 1;
  this.frameTotal = 1;
  this.updateEyesSprite(this.direction);
  this.moveState = 'base';
  this.changeTarget();
  this.changeVel(this.baseVel);
  State.myGame.bigPillGhostsEaten += 1;
  State.myGame.updateScore('G');
  let msg = ''+ Math.pow(2,State.myGame.bigPillGhostsEaten) +'00';
  this.eatenTxtBox = new TxtBox(/* x     */ this.x,
                                /* y     */ this.y+4,
                                /* msg   */ msg,
                                /* color */ Colors.ghostAqua,
                                /* dur   */ 2000,
                                /* font  */ '20px joystix'
  );
  this.eatenTxtBox.startTimer();
  State.myGame.pauseAllChars(500);
  State.myGame.sounds.ghost.play();
};  // initEaten

Ghost.prototype.updateSprite = function(dir) {
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
    if (LOGS) console.log('ghost updateSprite probs');
  }
};  // updateSprit

Ghost.prototype.updateEyesSprite = function(dir) {
  if (dir === 'right') {
    this.frame0 = 5;
    this.curFrame = 5;
  } else if (dir === 'left') {
    this.frame0 = 4;
    this.curFrame = 4;
  } else if (dir === 'up') {
    this.frame0 = 6;
    this.curFrame = 6;
  } else if (dir === 'down') {
    this.frame0 = 7;
    this.curFrame = 7;
  } else {
    if (LOGS) console.log('ghost updateEyesSprite probs');
  }
}; // updateEyesSprite

Ghost.prototype.nextSpriteFrame = function() { // updates animation frame
  if (this.curFrame < (this.frame0 + this.frameTotal-1)) {
    this.curFrame += 1;
  } else {
    this.curFrame = this.frame0;
  }
}; // nextSpriteFrame

Ghost.prototype.moveGhost = function() {
  let edgeGap = 10;
  if ( (this.direction === 'left') || (this.direction === 'right') ) {
    if ((this.x+this.vel) > (State.canvas.width-edgeGap)) {  // handle the TUNNEL
      this.x = edgeGap*2;
    } else if ((this.x+this.vel) < edgeGap) {
      this.x = State.canvas.width-(edgeGap*2);
    } else {
      this.x += this.vel;
    }
  } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
    this.y += this.vel;
  } else {
    if (LOGS) console.log(' move ghost problems ');
  }
}; // moveGhost

Ghost.prototype.checkHitPac = function() {
  let xDif = Math.abs(this.x - State.myGame.myPac.x);
  let yDif = Math.abs(this.y - State.myGame.myPac.y);
  if ( ((xDif < 20) && (yDif < 20)) ) {
    if (LOGS) console.log('ghost collide pac');
    if ( (this.moveState === 'chase') || (this.moveState === 'scatter') ) {
      State.myGame.myPac.die();
    } else if (this.moveState === 'flee') {
      this.initEaten();
    } else if (this.moveState === 'base') {
      // ghost gets hit again but he's already hit so ignore
    } else {
      // nothin
    }
  }
};

Ghost.prototype.isNewInter = function() { // returns true if currnt intersection is dif then prevInter
  let isNew = false;
  let curInter = getNearestIntersection(this.x,this.y);
  // either row or col changed since last intersection then it's ok to get a new direction
  if ( (this.prevInter.row !== curInter.row) || (this.prevInter.col !== curInter.col) ) {
    isNew = true;
  }
  // if (LOGS) console.log('isNewInter = ', isNew);
  return isNew;
};  // isNewInter

Ghost.prototype.draw = function() {
  if (this.moveState === 'lvlchange') {
      // don't draw ghost
  } else {
      let spacing = State.gridSpacing;
      // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      State.ctx.drawImage(  /*image*/   this.spriteSheet,
                      /* sx */    (this.curFrame)*(this.spriteFrameWidth), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
                      /* sy */    (this.spriteRow)*(this.spriteFrameWidth),
                      /*sWidth*/  this.spriteFrameWidth,
                      /*sHeight*/ this.spriteFrameWidth,
                      /* dx */    this.x-spacing+2,
                      /* dy */    this.y-spacing+2,
                      /*dWidth*/  spacing*2-6,
                      /*dHidth*/  spacing*2-6
      );
      if (this.eatenTxtBox !== undefined) {
        if (this.eatenTxtBox.show === true) {
          this.eatenTxtBox.draw();
        }
      }
  } // end else
};  // draw

Ghost.prototype.update = function() {
  if ( (this.moveState === 'chase') && (State.gameStarted = true) ) {
        if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) { // check which way to go
            this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
            this.changeTarget();
            let newDir = this.getNewDirection();
            if (newDir !== this.direction) {
              this.changeDir(newDir);
              this.updateSprite(newDir);
              this.hopToIn();
              this.timedPause(30); // 30ms pauses at intersections
              this.moveGhost();
            } else {
              this.moveGhost();
              if (this.inTunnel() === true) {
                this.changeVel(this.tunnelVel);
              } else {
                this.changeVel(this.chaseVel);
              }
            }
        } else {
          this.moveGhost();
        }
        this.checkHitPac();
  } else if (this.moveState === 'flee') {  // run to designated corner of screen
        if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) { // check which way to go
            this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
            let newDir = this.getNewDirection();
            if (newDir !== this.direction) {
              this.changeDir(newDir);
              this.hopToIn();
              this.timedPause(30); // 30ms pauses at intersections
              this.moveGhost();
            } else {
              this.moveGhost();
              if (this.inTunnel() === true) {
                this.changeVel(this.tunnelVel);
              } else {
                this.changeVel(this.fleeVel);
              }
            }
        } else {
          this.moveGhost();
        }
        this.checkHitPac();
  } else if (this.moveState === 'scatter') { // run towards designated corner for a small amount of time
      if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) { // check which way to go
          this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
          let newDir = this.getNewDirection();
          if (newDir !== this.direction) {
            this.changeDir(newDir);
            this.updateSprite(newDir);
            this.hopToIn();
            this.timedPause(30); // 30ms pauses at intersections
            this.moveGhost();
          } else {
            this.moveGhost();
            if (this.inTunnel() === true) {
              this.changeVel(this.tunnelVel);
            } else {
              this.changeVel(this.chaseVel);
            }
          }
      } else {
        this.moveGhost();
      }
      this.checkHitPac();
  } else if (this.moveState === 'base') { // ghost was eaten move to base
        if ( (Math.abs(this.x - this.targetX) <= this.vel+2) && (Math.abs(this.y - this.targetY) <= this.vel+2) ) {  // ghost has arrived in base, resume chase
          this.startExitBase();
        } else if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) {
            this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
            let newDir = this.getNewDirection();
            if (newDir !== this.direction) {
              this.updateEyesSprite(newDir);
              this.changeDir(newDir);
              this.hopToIn();
              this.moveGhost();
            } else {
              this.moveGhost();
            }
        } else {
          this.moveGhost();
        }
  } else if (this.moveState === 'chillbase') {
      this.nextChillAnim();
  } else if (this.moveState === 'exitbase') {
        if (Math.abs(this.y - this.targetY) <= 4) { // only need to check the Y dir because it's going up
            // if (LOGS) console.log('EXIT REACHED');
            this.startChase();
        } else if ( (Math.abs(((this.x + this.vel) - this.targetX)) <= (Math.abs(this.vel)-1) ) && (this.x !== this.targetX) ) { // if close to targetX, snap to targetX
          this.x = this.targetX;
          this.vel = this.exitBaseVel;
          this.changeDir('up');
          this.updateSprite('up');
        } else {
          this.moveGhost();
        }
  } else if (this.moveState === 'tpaused') {
        // check to see if it's time to resume movement after an intersection
        if (this.timedPauseState === true) {
          if ((performance.now() - this.timedPauseBegin) > this.timedPauseDur) {
            this.tmpUnpause();
          }
        }
  } else if (this.moveState === 'stop') {
    // nothin
  } else if   (this.moveState === 'lvlchange') {
    // nothin
  } else {
    // nothin
  }
  // update the animation frame
  if ((State.playTime % this.spriteFrameDur) < 17) { this.nextSpriteFrame(); }
  // check TxtBox should clear
  if (this.eatenTxtBox !== undefined) {
    this.eatenTxtBox.update();
  }
}; // update





function getGhostChangeTarget(ghostName) {
  let spacing = State.gridSpacing;
  if (ghostName === 'blinky') { // BLINKY ONLY
    // if (LOGS) console.log('blinky gets a prototype');
    State.myGame.ghosts[0].changeTarget = function() {
      if (this.moveState === 'chase') {
        this.targetX = State.myGame.myPac.x;
        this.targetY = State.myGame.myPac.y;
      } else if (this.moveState === 'flee') {
        this.targetX = spacing*24;
        this.targetY = spacing*1;
      } else if (this.moveState === 'scatter') {
        this.targetX = spacing*24;
        this.targetY = spacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = spacing*14+(spacing/2);
        this.targetY = spacing*15;
      } else if (this.moveState === 'exitbase') {
        this.targetX = spacing*14+(spacing/2);
        this.targetY = spacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'pinky') { // PINKY ONLY
    // if (LOGS) console.log('pinky gets a prototype');
    State.myGame.ghosts[1].changeTarget = function() {
      if (this.moveState === 'chase') {
          if (State.myGame.myPac.direction === 'left') {
            this.targetX = State.myGame.myPac.x - (spacing*2);
            this.targetY = State.myGame.myPac.y;
          } else if (State.myGame.myPac.direction === 'right') {
            this.targetX = State.myGame.myPac.x + (spacing*2);
            this.targetY = State.myGame.myPac.y;
          } else if (State.myGame.myPac.direction === 'up') {
            this.targetX = State.myGame.myPac.x;
            this.targetY = State.myGame.myPac.y - (spacing*2);
          } else if (State.myGame.myPac.direction === 'down') {
            this.targetX = State.myGame.myPac.x;
            this.targetY = State.myGame.myPac.y + (spacing*2);
          } else {
            if (LOGS) console.log('pinky changeTarget pac positioning prob');
          }
      } else if (this.moveState === 'flee') {
        this.targetX = spacing*1;
        this.targetY = spacing*1;
      } else if (this.moveState === 'scatter') {
        this.targetX = spacing*1;
        this.targetY = spacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = this.startPosX;
        this.targetY = this.startPosY;
      } else if (this.moveState === 'exitbase') {
        // if (LOGS) console.log(this.name +" exitbase movestate updated" );
        this.targetX = spacing*14+(spacing/2);
        this.targetY = spacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'inky') {
    // if (LOGS) console.log('inky gets a prototype');
    State.myGame.ghosts[2].changeTarget = function() {
      if (this.moveState === 'chase') {
        this.targetX = State.myGame.myPac.x;
        this.targetY = State.myGame.myPac.y;
      } else if (this.moveState === 'flee') {
        this.targetX = spacing*27;
        this.targetY = spacing*30;
      } else if (this.moveState === 'scatter') {
        this.targetX = spacing*27;
        this.targetY = spacing*30;
      } else if (this.moveState === 'base') {
        this.targetX = this.startPosX+(spacing/2);  // this is to offset the fact that ghost can't reach startPosX
        this.targetY = this.startPosY;
      } else if (this.moveState === 'exitbase') {
        this.targetX = spacing*14+(spacing/2);
        this.targetY = spacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'clyde') {
    // if (LOGS) console.log('clyde gets a prototype');
    State.myGame.ghosts[3].changeTarget = function() {
      let pac = State.myGame.myPac;
      if (this.moveState === 'chase') {
        //  when 8 tiles or less away from BLINKY.. he moves like BLINKY (moves straight for pacman)
        //  when within 8 tiles of PACMAN.. he flees to the bottom left portion of screen
        if (this.nearPac() === true) { // go to corner
          this.targetX = spacing*1;
          this.targetY = spacing*30;
        } else {
          this.targetX = pac.x;
          this.targetY = pac.y;
        }
      } else if (this.moveState === 'flee') {
        this.targetX = spacing*1;
        this.targetY = spacing*30;
      } else if (this.moveState === 'scatter') {
        this.targetX = spacing*1;
        this.targetY = spacing*30;
      } else if (this.moveState === 'base') {
        this.targetX = this.startPosX-(spacing/2);  // this is to offset the fact that ghost can't reach startPosX
        this.targetY = this.startPosY;
      } else if (this.moveState === 'exitbase') {
        this.targetX = spacing*14+(spacing/2);
        this.targetY = spacing*12;
      } else {
        // nothin
      }
    };  // changeTarget

    State.myGame.ghosts[3].nearPac = function() {
      let sp = State.gridSpacing;
      let pac = State.myGame.myPac;
      let gh = State.myGame.ghosts[3];
      let nearBool = null;
      // is clyde 8 spacing from pac on X or Y
      if ( ((pac.x > gh.x) && (Math.floor((pac.x - gh.x) / sp) >= 8)) || ((pac.x < gh.x) && (Math.floor((gh.x - pac.x) / sp) >= 8)) ||
           ((pac.y > gh.y) && (Math.floor((pac.y - gh.y) / sp) >= 8)) || ((pac.y < gh.y) && (Math.floor((gh.y - pac.y) / sp) >= 8)) )  {
        nearBool = false;
      } else {
        nearBool = true;
      }
      return nearBool;
    }; // nearPac
  } else {
    if (LOGS) console.log('getGhostChangeTarget probs');
  }
}



/*
 GHOSTS
 GHOSTS
 GHOSTS

 some info here https:www.youtube.com/watch?v=l7-SHTktjJc

 more here https:www.gamasutra.com/view/feature/3938/the_pacman_dossier.php?print=1

 best info here http:gameinternals.com/post/2072558330/understanding-pac-man-ghost-behavior

 CHARACTER  /  NICKNAME
 SHADOW aka "BLINKY" - RED - goes straight for PacMan always
                           - he gets slightly faster over time (per level?) known as "Cruise Elroy"
                           - this is based directly on number of dots eaten (depends on lvl playing)
                           - stops being cruise elroy when pac dies
                           - his speed increases by 5% and his behavior in Scatter mode changes.
                            Even though Blinky’s targeting method is very simple, he does have one idiosyncrasy that the other ghosts do not; at two defined points in each level (based on the number of dots remaining), his speed increases by 5% and his behavior in Scatter mode changes. The timing of the speed change varies based on the level, with the change occurring earlier and earlier as the player progresses. The change to Scatter targeting is perhaps more significant than the speed increases, since it causes Blinky’s target tile to remain as Pac-Man’s position even while in Scatter mode, instead of his regular fixed tile in the upper-right corner. This effectively keeps Blinky in Chase mode permanently, though he will still be forced to reverse direction as a result of a mode switch. When in this enhanced state, Blinky is generally referred to as “Cruise Elroy”, though the origin of this term seems to be unknown. Not even the almighty Pac-Man Dossier has an answer here. If Pac-Man dies while Blinky is in Cruise Elroy mode, he reverts back to normal behavior temporarily, but returns to Elroy mode as soon as all other ghosts have exited the ghost house.

 SPEEDY aka "PINKY" - PINK - starts in ghost house but exits right away
                           - japanese word for him translates to 'chaser'
                           - he tries to land on the tile 2 tiles from pacman like and ambush
                           - old glitch: if pac facing up... tries to land on tile 4 in front and 4 to the left of pac

 BASHFUL aka "INKY" - AUQA  - stays in ghost house until pac man eats 30 small dots
                            - determined by 2 things: Pac facing direction AND blinky's vector
                            - targets tile 2 ahead of pacman and doubling the distance Blinky is away from it
                            - draw a vector from Blinky to 2 tiles ahead of pac... then double that distance is same direction
                            - also glitched... if pac facing up target tile is 2 ahead of pac and 2 to the left
                            - Japanese name is "kimagure" - 'fickle'

 POKEY aka "CLYDE" -  YELLOW - movments based on distance to PacMan
                             - leaves base after 1/3 of dots eaten (244/3 ~= 83)
                             - when 8 tiles or less away from BLINKY.. he moves like BLINKY (moves straight for pacman)
                             - when within 8 tiles of PACMAN.. he flees to the bottom left portion of screen
                             - Japanese name "otoboke" - 'feining ignorance'

 EVERY GHOST - has 3 MODES    1. Chase - normal as described above
                              2. Scatter - after a few seconds of gameplay depending on current level, they 'scatter' to a different corner of the map
                                         - BLINKY - top right
                                         - PINKY - top left
                                         - INKY - bottom right
                                         - CLYDE - bottom left
                                         - they enter the scatter mode a max of 4 TIMES per pac life or lvl
                                         - if scatter is done.. they will CHASE forever
                                3. Freighten - all turn blue and run away (aka 'flee')
                                             - all reverse direction
                                             - at corner psuedo random direction is chosen
                                             -
                                             -
 SCATTER MODE:
  - when game starts scatter is ON
  - Ghosts alternate between scatter and chase modes on timers
  - All ghosts ghosts simultaneously reverse direction
  - Scatter modes happen 4 times per level before the ghosts stay in chase mode indefinitely.
  - scatter timer reset after Pac Dies
       Scatter for 7 seconds, then Chase for 20 seconds.
       Scatter for 7 seconds, then Chase for 20 seconds.
       Scatter for 5 seconds, then Chase for 20 seconds.
       Scatter for 5 seconds, then switch to Chase mode permanently.


 FRIGHTENED MODE:  (aka 'flee')
  - Ghosts turn blue for length of time depending on lvl.
  - ghosts reverse direciton when mode starts
  - ghosts move slower
  - ghosts move in psudo random direciton after
      - every ghost life and level they choose a random direction to use when fightened
      - if a wall blocks this random seeded direction then they look for an alternate dir in this order:
          up, left, down, right  until one works



  there are some SAFE ZONES in some levels where pac and go and never be attacked

  PACMAN always turns corners INSTANTLY vs GHOSTS which pause for just a moment at each intersection

  Ghosts MOVE SLOWER in tunnel

  level start - INKY-PINKY-CLYDE are in the ghost house at the beginning - two side facing up and PINKY facing down
              - only BLINKY is outside and facing left
              - READY! in the middle of the screen


*/
