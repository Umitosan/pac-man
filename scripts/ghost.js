/*jshint esversion: 6 */

function Ghost(x,y,name,src,frame0) {
  // general
  this.x = x;
  this.y = y;
  this.name = name;
  this.spriteImgSrc = src;
  this.chaseVel = 2.5;
  this.vel = 2.5;
  this.targetX = 'none';
  this.targetY = 'none';
  this.direction = 'up';
  this.moveState = 'exitbase'; // chase, flee, base, exitbase, stop, intersection
  this.lastMoveState = 'paused';
  this.eatenTxtBox = undefined;
  this.prevInter = null; // used to prevent changing dir 2 times at same interseciton when chasing

  // sprite stuff
  this.spriteSheet = new Image();
  this.spriteRow = 0;
  this.frame0 = frame0;
  this.curFrame = frame0;
  this.frameTotal = 2;
  this.spriteFrameDur = 150;
  this.spriteFrameWidth = 64;  // in pixels

  // ghost pause
  this.tmpPauseState = false;
  this.tmpPauseBegin = null;
  this.tmpPauseDur = 0;

  this.init = function() {
    getGhostChangeTarget(this.name);
    this.spriteSheet.src = this.spriteImgSrc;
    this.targetX = State.gridSpacing*14;
    this.targetY = State.gridSpacing*12;
    this.changeDir(this.direction);
    this.updateSprite(this.direction);
  };

  this.changeTarget = function() {
    // to be filled at this.init()
    // defined specifically for each ghost at getGhostChangeTarget()
  };

  this.tryDirs = function(dir1,dir2,dir3) { // tests 3 directions inBounds and returns first good one
    let someDir;
    if (this.inBounds(dir1) === true) {
      someDir = dir1;
    } else if (this.inBounds(dir2) === true) {
      someDir = dir2;
    } else if (this.inBounds(dir3) === true) {
      someDir = dir3;
    } else {
      someDir = undefined;
      console.log('ghost: tryDir prob');
    }
    return someDir;
  };

  // BLINKY ONLY
  this.getNewDirection = function() { // returns new direction based on target's coords
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
                      newDir = this.tryDirs('down',this.direction,'up');
                  } else if (yDif > 0) { // try up, stright, down
                      newDir = this.tryDirs('up',this.direction,'down');
                  } else if (yDif === 0) { // try straight, up, down (this maybe should be random up or down)
                      newDir = this.tryDirs(this.direction,'up','down');
                  } else { // try straight, up, down (this maybe should be random up or down)
                      newDir = this.tryDirs(this.direction,'up','down');
                  }
              }
      } else if (Math.abs(yDif) > Math.abs(xDif)) {
              if (yDif < 0) { // try down straight up
                  newDir = newDir = this.tryDirs('down',this.direction,'up');
              } else if (yDif > 0) { // try up straight down
                newDir = newDir = this.tryDirs('up',this.direction,'down');
              } else { // try straight up down (this maybe should be random up down)
                newDir = newDir = this.tryDirs(this.direction,'up','down');
              }
      } else {
        console.log('ghost: getNewDir right prob');
      }
    } else if (this.direction === 'left') {
            if (Math.abs(xDif) >= Math.abs(yDif)) {
              if ( (xDif > 0) && (this.inBounds(this.direction) === true) ) { // try go left if ideal
                newDir = this.direction;
              } else { // get best up or down or straight
                  if (yDif < 0) {  // try down, stright, up
                      newDir = this.tryDirs('down',this.direction,'up');
                  } else if (yDif > 0) { // try up, stright, down
                      newDir = this.tryDirs('up',this.direction,'down');
                  } else if (yDif === 0) { // try straight, up, down (this maybe should be random up or down)
                     newDir = this.tryDirs(this.direction,'up','down');
                  } else { // try straight, up, down (this maybe should be random up or down)
                      newDir = this.tryDirs(this.direction,'up','down');
                  }
              }
      } else if (Math.abs(yDif) > Math.abs(xDif)) {
              if (yDif < 0) { // try down straight up
                  newDir = newDir = this.tryDirs('down',this.direction,'up');
              } else if (yDif > 0) { // try up straight down
                newDir = newDir = this.tryDirs('up',this.direction,'down');
              } else { // try straight up down (this maybe should be random up down)
                newDir = newDir = this.tryDirs(this.direction,'up','down');
              }
      } else {
        console.log('ghost: getNewDir left prob');
      }
    } else if (this.direction === 'up') {
      if (Math.abs(yDif) >= Math.abs(xDif)) { // ghost wants to move in Y dir
              if ( (yDif > 0) && (this.inBounds(this.direction) === true) ) { // try go up if ideal
                newDir = this.direction;
              } else { // get best right or left or straight
                  if (xDif < 0) { // try right, straight, left
                      newDir = this.tryDirs('right',this.direction,'left');
                  } else if (xDif > 0) {  // try left, striaght, right
                      newDir = this.tryDirs('left',this.direction,'right');
                  } else if (xDif === 0) { // try straight, left, right (this maybe should be random left right)
                      newDir = this.tryDirs(this.direction,'left','right');
                  } else { // try straight, left,right (this maybe should be random left right)
                      newDir = this.tryDirs(this.direction,'left','right');
                  }
              }
      } else if (Math.abs(xDif) > Math.abs(yDif)) { // ghost wants to move in X dir
              if (xDif < 0) { // try right straight left
                newDir = newDir = this.tryDirs('right',this.direction,'left');
              } else if (xDif > 0) { // try left straight right
                newDir = newDir = this.tryDirs('left',this.direction,'right');
              } else { // try straight left right (this maybe should be random left right)
                newDir = this.tryDirs(this.direction,'left','right');
              }
      } else {
        console.log('ghost: getNewDir left prob');
      }
    } else if (this.direction === 'down') {
      if (Math.abs(yDif) >= Math.abs(xDif)) {
              if ( (yDif < 0) && (this.inBounds(this.direction) === true) ) { // try go down if ideal
                newDir = this.direction;
                // console.log('ghost SAME DIR');
              } else { // get best right or left or straight
                  if (xDif < 0) { // try right, straight, left
                      newDir = this.tryDirs('right',this.direction,'left');
                  } else if (xDif > 0) {  // try left, striaght, right
                      newDir = this.tryDirs('left',this.direction,'right');
                  } else if (xDif === 0) { // try straight, left,right (this maybe should be random left right)
                      newDir = this.tryDirs(this.direction,'left','right');
                  } else { // try straight, left,right (this maybe should be random left right)
                      newDir = this.tryDirs(this.direction,'left','right');
                  }
              }
      } else if (Math.abs(xDif) > Math.abs(yDif)) {
              if (xDif < 0) { // try right straight left
                newDir = newDir = this.tryDirs('right',this.direction,'left');
              } else if (xDif > 0) { // try left straight right
                newDir = newDir = this.tryDirs('left',this.direction,'right');
              } else { // try straight left right (this maybe should be random left right)
                newDir = this.tryDirs(this.direction,'left','right');
              }
      } else {
        console.log('ghost: getNewDir left prob');
      }
    } else {
      console.log('ghost: getNewDirection prob' );
    }
    return newDir;
  };

  this.changeDir = function(newDir) {
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
    // console.log('changeDir to ', this.direction);
  };

  this.changeVel = function(newVel) {
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
      console.log(' changeVel problems ');
    }
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
    var off = this.vel;

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
      case ( (tDir === 'down') && ( getNearestIntersection(this.x,this.y+sp-off).char === "#") ):
        // console.log("DOWN bounds hit ", getNearestIntersection(this.x,this.y+sp-off) );
        bounds = false;  break;
      case ( (tDir === 'down') && ( getNearestIntersection(this.x,this.y+sp-off).char === "W") && (this.moveState !== 'base') ):
        // let the ghost go into the base to reset after being eaten
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

  this.tryReverseDir = function() {
    let dir = this.direction;
    if (dir === 'right') {
      if (this.inBounds('left') === true) {
        this.changeDir('left');
      } else {
        console.log('tryReverse but cant go... '+'left');
      }
    } else if (dir === 'left') {
      if (this.inBounds('right') === true) {
        this.changeDir('right');
      } else {
        console.log('tryReverse but cant go... '+'right');
      }
    } else if (dir === 'up') {
      if (this.inBounds('down') === true) {
        this.changeDir('down');
      } else {
        console.log('tryReverse but cant go... '+'down');
      }
    } else if (dir === 'down') {
      if (this.inBounds('up') === true) {
        this.changeDir('up');
      } else {
        console.log('tryReverse but cant go... '+'up');
      }
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

  this.startBlinking = function() {
    if (this.moveState === 'flee') {
      this.frameTotal = 4;
    }
  };

  this.stopBlinking = function() {
    if (this.moveState === 'flee') {
      console.log('STOP BLINKING');
      this.frameTotal = 2;
      this.spriteRow = 1;
      this.frame0 = 0;
      this.curFrame = 0;
    }
  };

  this.startFlee = function() {
    if (this.moveState === 'flee') {
      console.log('ghost already fleeing, stop blining');
      this.stopBlinking();
    } else if (this.moveState === 'chase') {
      console.log('ghost: flee started - '+this.name);
      this.moveState = 'flee';
      this.tryReverseDir();
      this.prevInter = getNearestIntersection(this.x,this.y);
      this.spriteRow = 1;
      this.frame0 = 0;
      this.curFrame = 0;
    } else {
      // wrong state so nothin
    }
  };

  this.stopFlee = function() {
    console.log('ghost stop flee run');
    if (this.moveState === 'flee') {
      console.log('ghost flee stopped');
      this.moveState = 'chase';
      this.spriteRow = 0;
      this.frameTotal = 2;
      this.changeVel(this.chaseVel);
      this.updateSprite(this.direction);
    } else {
      // nothin
    }
  };

  this.stopBase = function() { // after returning to base, reset state to exitbase etc
    this.moveState = 'exitbase';
    this.changeTarget();
    this.spriteRow = 0;
    this.frameTotal = 2;
    this.hopToIn();
    this.changeDir('up');
    this.changeVel(this.chaseVel);
    this.updateSprite(this.direction);
  };

  this.startChase = function() {
    console.log("Ghost: startChase");
    this.prevInter = getNearestIntersection(this.x,this.y); // set initial prevInter at start of chase
    this.moveState = 'chase';
    this.changeVel(this.chaseVel);
    this.spriteRow = 0;
    this.hopToIn();
    let newDir = this.getNewDirection();
    this.changeDir(newDir);
    this.updateSprite(newDir);
  };

  this.initEaten = function() {
    // stop fleeing
    // ghost eaten by pac
    // small pause
    // update sprite
    // update ghost goal to inside ghost house
    // update velocity
    // show score txt on game
    this.stopFlee();
    myGame.bigPillGhostsEaten += 1;
    this.spriteRow = 1;
    this.frameTotal = 1;
    this.updateEyesSprite(this.direction);
    this.moveState = 'base';
    this.changeTarget();
    this.changeVel(5);
    let msg = ''+ Math.pow(2,myGame.bigPillGhostsEaten) +'00';
    this.eatenTxtBox = new TxtBox(/* x     */ this.x,
                                  /* y     */ this.y+10,
                                  /* msg   */ msg,
                                  /* color */ Colors.white,
                                  /* dur   */ 2000
    );
    console.log('this.eatenTxtBox = ', this.eatenTxtBox);
    myGame.pauseAllChars(500);
  };

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

  this.updateEyesSprite = function(dir) {
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
      console.log('ghost updateEyesSprite probs');
    }
  };

  this.nextFrame = function() { // updates animation frame
    if (this.curFrame < (this.frame0 + this.frameTotal-1)) {
      this.curFrame += 1;
    } else {
      this.curFrame = this.frame0;
    }
  }; // nextFrame

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

  this.draw = function() {
    // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
    // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    ctx.drawImage(  /*image*/   this.spriteSheet,
                    /* sx */    (this.curFrame)*(this.spriteFrameWidth), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
                    /* sy */    (this.spriteRow)*(this.spriteFrameWidth),
                    /*sWidth*/  this.spriteFrameWidth,
                    /*sHeight*/ this.spriteFrameWidth,
                    /* dx */    this.x-State.gridSpacing+2,
                    /* dy */    this.y-State.gridSpacing+2,
                    /*dWidth*/  State.gridSpacing*2-6,
                    /*dHidth*/  State.gridSpacing*2-6
    );
    if (this.eatenTxtBox !== undefined) {
      this.eatenTxtBox.draw();
    }
  };

  this.checkHitPac = function() {
    let xDif = Math.abs(this.x - myGame.myPac.x);
    let yDif = Math.abs(this.y - myGame.myPac.y);
    if ( ((xDif < 20) && (yDif < 20)) ) {
          console.log('ghost collide pac');
          if (this.moveState === 'chase') {
            myGame.myPac.die();
          } else if (this.moveState === 'flee') {
            this.initEaten();
          } else if (this.moveState === 'base') {
            // ghost gets hit again but he's already hit so ignore
          } else {
            // nothin
          }
       }
  };

  this.isNewInter = function() { // returns true if currnt intersection is dif then prevInter
    let isNew = false;
    let curInter = getNearestIntersection(this.x,this.y);
    // either row or col changed since last intersection then it's ok to get a new direction
    if ( (this.prevInter.row !== curInter.row) || (this.prevInter.col !== curInter.col) ) {
      isNew = true;
    }
    // console.log('isNewInter = ', isNew);
    return isNew;
  };

  this.update = function() {
    if ( (this.moveState === 'chase') && (State.gameStarted = true) ) {
          if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) { // check which way to go
              this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
              this.changeTarget();
              let newDir = this.getNewDirection();
              if (newDir !== this.direction) {
                this.changeDir(newDir);
                this.updateSprite(newDir);
                this.hopToIn();
                this.tmpPause(30); // 30ms pauses at intersections
                this.moveGhost();
              } else {
                this.moveGhost();
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
                this.tmpPause(30); // 30ms pauses at intersections
                this.moveGhost();
              } else {
                this.moveGhost();
              }
          } else {
            this.moveGhost();
          }
          this.checkHitPac();
    } else if (this.moveState === 'base') { // ghost was eaten move to base
          if ( (Math.abs(this.x - this.targetX) <= this.vel) && (Math.abs(this.y - this.targetY) <= this.vel) ) {  // ghost has arrived in base, resume chase
            this.stopBase();
          } else if ( atGridIntersection(this.x,this.y,this.vel) && (this.isNewInter() === true) ) {
              this.prevInter = getNearestIntersection(this.x,this.y); // helps prevent changing dir 2 times at same interseciton
              let newDir = this.getNewDirection();
              // console.log('ghost flee attempting dir = ', newDir);
              // console.log('cur dur = ', this.direction);
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
    } else if (this.moveState === 'exitbase') {
          if ( (Math.abs(this.x - this.targetX) <= 4) && (Math.abs(this.y - this.targetY) <= 4) ) {
            this.startChase();
          } else if ( atGridIntersection(this.x,this.y,this.vel) ) {
              let newDir = this.getNewDirection();
              if (newDir !== this.direction) {
                this.changeDir(newDir);
                this.updateSprite(newDir);
                this.hopToIn();
                // this.tmpPause(100); // ghost pauses at intersections
              } else {
                this.moveGhost();
              }
          } else {
            this.moveGhost();
          }
    } else if (this.moveState === 'paused') {
          // console.log('ghost stopped');
          // console.log('FIRST dif = ',(performance.now() - this.intersectionPauseBegin) );
          // check to see if it's time to resume movement after an intersection
          if (this.tmpPauseState === true) {
            if ((performance.now() - this.tmpPauseBegin) > this.tmpPauseDur) {
              this.tmpUnpause();
            }
          }
    } else if (this.moveState === 'stop') {
      // nothin
    } else {
      // nothin
    }
    // update the animation frame
    if ((State.playTime % this.spriteFrameDur) < 17) { this.nextFrame(); }
    // check TxtBox should clear
    if (this.eatenTxtBox !== undefined) {
      if ((performance.now() - this.eatenTxtBox.startTime) > this.eatenTxtBox.duration ) {
        this.eatenTxtBox = undefined;
      }
    }
  }; // update

} // GHOST



function getGhostChangeTarget(ghostName) {
  if (ghostName === 'blinky') {
    console.log('blinky gets a prototype');
    myGame.ghosts[0].changeTarget = function() {
      if (this.moveState === 'chase') {
        this.targetX = myGame.myPac.x;
        this.targetY = myGame.myPac.y;
      } else if (this.moveState === 'flee') {
        this.targetX = State.gridSpacing*1;
        this.targetY = State.gridSpacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*15;
      } else if (this.moveState === 'exitbase') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'pinky') {
    console.log('pinky gets a prototype');
    myGame.ghosts[1].changeTarget = function() {
      if (this.moveState === 'chase') {
          if (myGame.myPac.direction === 'left') {
            this.targetX = myGame.myPac.x - (State.gridSpacing*2);
            this.targetY = myGame.myPac.y;
          } else if (myGame.myPac.direction === 'right') {
            this.targetX = myGame.myPac.x + (State.gridSpacing*2);
            this.targetY = myGame.myPac.y;
          } else if (myGame.myPac.direction === 'up') {
            this.targetX = myGame.myPac.x;
            this.targetY = myGame.myPac.y - (State.gridSpacing*2);
          } else if (myGame.myPac.direction === 'down') {
            this.targetX = myGame.myPac.x;
            this.targetY = myGame.myPac.y + (State.gridSpacing*2);
          } else {
            console.log('pinky changeTarget pac positioning prob');
          }
      } else if (this.moveState === 'flee') {
        this.targetX = State.gridSpacing*1;
        this.targetY = State.gridSpacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*15;
      } else if (this.moveState === 'exitbase') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'inky') {
    console.log('inky gets a prototype');
    myGame.ghosts[0].changeTarget = function() {
      if (this.moveState === 'chase') {
        this.targetX = myGame.myPac.x;
        this.targetY = myGame.myPac.y;
      } else if (this.moveState === 'flee') {
        this.targetX = State.gridSpacing*1;
        this.targetY = State.gridSpacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*15;
      } else if (this.moveState === 'exitbase') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*12;
      } else {
        // nothin
      }
    };
  } else if (ghostName === 'clyde') {
    console.log('clyde gets a prototype');
    myGame.ghosts[0].changeTarget = function() {
      if (this.moveState === 'chase') {
        this.targetX = myGame.myPac.x;
        this.targetY = myGame.myPac.y;
      } else if (this.moveState === 'flee') {
        this.targetX = State.gridSpacing*1;
        this.targetY = State.gridSpacing*1;
      } else if (this.moveState === 'base') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*15;
      } else if (this.moveState === 'exitbase') {
        this.targetX = State.gridSpacing*14;
        this.targetY = State.gridSpacing*12;
      } else {
        // nothin
      }
    };
  } else {
    console.log('getGhostChangeTarget probs');
  }
}




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
