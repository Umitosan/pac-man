/* jshint esversion: 6 */

function Pac(x,y,velocity,direction,moveState)  {
  this.startPosX = x;
  this.startPosY = y;
  this.x = x;
  this.y = y;
  this.vel = 3;
  this.lives = 2;
  this.diameter = (State.gridSpacing*2)-10;
  this.radius = ((State.gridSpacing*2)-10)/2;
  this.color = Colors.pacYellow;
  this.lineW = 2;
  this.pixX = 0; // pixel test
  this.pixY = 0; // pixel test
  this.moveState = moveState; // go, stop, paused, dying1, dying2
  this.lastMoveState = 'paused';
  this.direction = direction; // also relates to mouth direction and rotation

  // mouth
  this.mouthSize = getRadianAngle(70);
  this.maxMouthSize = getRadianAngle(70);
  this.minMouthSize = getRadianAngle(2);
  this.mouthVel = getRadianAngle(8);
  this.rotateFace = 0;
  this.deathMouthDur = 50;
  this.deathMouthAnimFinished = false;
  this.deathSparkles = [];
  this.deathSparklesStart = undefined;
  this.deathSparklesDur = 3000; // ms

  // pac pause
  this.tmpPauseState = false;
  this.tmpPauseBegin = null;
  this.tmpPauseDur = 0;

  this.init = function() {
    this.tmpPause(2000);
  }; // init

  this.softReset = function() { // reset pac to original valuse
    console.log('pac softReset');
    // reset pac position
    this.x = this.startPosX;
    this.y = this.startPosY;
    // reset pac mouth
    this.mouthSize = getRadianAngle(70);
    this.mouthVel = getRadianAngle(8);
    this.rotateFace = 0;
    this.direction = 'right';
    // reset other vars
    this.vel = 3;
    this.deathSparkles = [];
    this.deathSparklesStart = undefined;
    this.deathMouthAnimFinished = false;
    // reset pac state
    this.lastMoveState = 'paused';
    State.lastDirKey = 'none';
    this.moveState = 'stop';
    this.tmpPause(2000);
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
      case ( (tDir === 'down') && (( getNearestIntersection(this.x,this.y+sp-off).char === "#") || ( getNearestIntersection(this.x,this.y+sp-off).char === "W")) ):
        // console.log("DOWN bounds hit ", getNearestIntersection(this.x,this.y+sp-off) );
        bounds = false;  break;
      default:
        // console.log('no bounds hit, keep going fwd');
        bounds = true; break;
    }

    return bounds;
  }; // inBounds

  this.changeDir = function(newDir) {
    this.direction = newDir;
    if (newDir === 'left') {
      this.vel = -Math.abs(this.vel);
      this.rotatePacFace();
    } else if (newDir === 'right') {
      this.vel = Math.abs(this.vel);
      this.rotatePacFace();
    } else if (newDir === 'up') {
      this.vel = -Math.abs(this.vel);
      this.rotatePacFace();
    } else if (newDir === 'down') {
      this.vel = Math.abs(this.vel);
      this.rotatePacFace();
    } else {
      console.log(' changeDir problems ');
    }
    this.moveState = 'go';
  };

  this.movePac = function() {
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
      console.log(' move pac problems ');
    }
  }; //move

  this.rotatePacFace = function() {
    // console.log("rotatePacFace");
    switch ( this.direction )  {
      case 'left':  this.rotateFace = Math.PI;  break;
      case 'right':  this.rotateFace = 0;  break;
      case 'up':  this.rotateFace = Math.PI*3/2;  break;
      case 'down':  this.rotateFace = Math.PI/2;  break;
      case 'stop': console.log("stopped");  break;
      default:
        console.log("rotatePacFace broke");
        break;
    } // end switch
  };

  this.hopToIn = function() {
    let data = getNearestIntersection(this.x,this.y);
    this.x = (data.col+1)*State.gridSpacing;
    this.y = (data.row+1)*State.gridSpacing;
  };

  this.tryEatPill = function() {
    let data = getNearestIntersection(this.x,this.y);
    let pillType = 'not pill';
    let r = data.row;
    let c = data.col;
    if ( (data.char === 0) || (data.char === 'B') ) {
      pillType = data.char;
      myGame.updateScore(data.char);
      myGame.myLevel.currentLevel[r][c] = '-';
      myGame.ghosts[2].updateDotsCounter(); // update inky
      myGame.ghosts[3].updateDotsCounter(); // update clyde
    }
    return pillType;
  };

  this.die = function() {
    // stop ghosts
    // stop pac
    // subtract -1 from pac lives
    // start death animations
    // finish death animations
    // soft game reset
    // start new life animation
    // resume game
    console.log('pac died, hit by ghost');
    this.moveState = 'dying1';
    myGame.stopAllGhosts();
    this.tmpPause(200);
    this.direction = 'up';
    this.rotatePacFace();
    this.mouthVel = getRadianAngle(3);
    this.mouthSize = getRadianAngle(20);
    this.lives -= 1;
    console.log('pac lives left: ', this.lives);
    myGame.updateLives();
    myGame.stopAllGhosts();
    if (this.lives === -1) {
      console.log("GAME OVER SON!");
      // game over
      // game over screen
    }
    console.log('pac movestate = ', this.moveState);
  };

  this.nextMouth = function() {
    if ( (this.mouthSize+this.mouthVel) >= this.maxMouthSize ) {
      this.mouthVel = -Math.abs(this.mouthVel);
    } else if ( (this.mouthSize+this.mouthVel) <= this.minMouthSize ) {
      this.mouthVel = Math.abs(this.mouthVel);
    } else {
      // nothing
    }
    this.mouthSize += this.mouthVel;
  };

  this.nextDeathMouth = function() {
    if (this.mouthSize > getRadianAngle(177)) { // mouth animation finished, proceed to death phase 2: sparkles
      console.log('mouth death done');
      this.deathMouthAnimFinished = true;
    } else { // animate the pac mouth death
      this.mouthSize += this.mouthVel;
    }
  };

  this.initDeathSparkles = function() {
    console.log('initDeathSparkles');
    this.moveState = 'dying2';
    this.deathSparklesStart = performance.now();
    for (var i = 0; i < 600; i++) {
      let randX =  this.x + getRandomIntInclusive(-15,15);
      let randY =  this.y + getRandomIntInclusive(-15,15);
      let randLen =  getRandomIntInclusive(10,30);
      let randAngle = getRandomIntInclusive(1,360);
      let randVel = getRandomIntInclusive(2,5) / 30;
      let color = randColor('rgba');
      this.deathSparkles.push({ x:     randX,
                                y:     randY,
                                angle: randAngle,
                                len:   randLen,
                                vel:   randVel,
                                color: color
                              });
    } // for
  }; // initDeathSparkles

  this.nextDeathSparkle = function() {
    for (let i = 0; i < this.deathSparkles.length; i++) {
      let angle = this.deathSparkles[i].angle;
      let len = this.deathSparkles[i].len;
      let vel = this.deathSparkles[i].vel;
      this.deathSparkles[i].x += (vel*(len*Math.cos(angle)));
      this.deathSparkles[i].y += (vel*(len*Math.sin(angle)));
    }
  };

  this.pixTest = function(sDir) {
    var xCoef = 0;
    var yCoef = 0;
    if ( sDir === 'left' ) {
      xCoef = -1;
    } else if (sDir === 'right') {
      xCoef = 1;
    } else if (sDir === 'up') {
      yCoef = -1;
    } else if (sDir === 'down') {
      yCoef = 1;
    } else {
      console.log('pixTestFront issues');
    }
    this.pixX = (this.x+((this.lineW+this.radius+2)*xCoef));
    this.pixY = (this.y+((this.lineW+this.radius+2)*yCoef));
    let pxData =  ctx.getImageData(this.pixX, this.pixY, 1, 1).data;
    let pxRgba = 'rgba('+pxData[0]+','+pxData[1]+','+pxData[2]+','+pxData[3]+')';
    return { data: pxData,
             rgbastr: pxRgba };
  };

  this.drawPixTestBox = function() {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.rect(this.pixX-5,this.pixY-5,10,10);
    ctx.stroke();
    $('.pixel-window').css( 'background-color', this.pixTest(this.direction).rgbastr );
  };

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.

    if (this.moveState === 'dying2') { // make the beautiful sparkles happen!
      for (let i = 0; i < this.deathSparkles.length; i++) {
        ctx.lineWidth = getRandomIntInclusive(1,12);
        ctx.strokeStyle = this.deathSparkles[i].color;
        // ctx.strokeStyle = Colors.pacYellow;
        // ctx.strokeStyle = randColor('rgba'); // full random color madness
        let x = this.deathSparkles[i].x;
        let y = this.deathSparkles[i].y;
        let angle = this.deathSparkles[i].angle;
        let len = this.deathSparkles[i].len;
        // single ray
        ctx.beginPath();
        ctx.moveTo( x , y );
        ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
        ctx.stroke();
      }
    } else {
      ctx.fillStyle = this.color;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.lineW;
      ctx.beginPath();
      ctx.translate(this.x,this.y);
      ctx.rotate(this.rotateFace);
      ctx.arc(0,0, this.radius, this.mouthSize, -this.mouthSize );
      ctx.lineTo(0,0);
      ctx.closePath();
      ctx.fill();   // fill the arc
      ctx.stroke();  // draw the line
      ctx.rotate(-this.rotateFace);
      ctx.translate(-this.x,-this.y);
    }
    if (myGame.pxBoxOn) this.drawPixTestBox();
  }; // draw

  this.update = function() {
    if (this.moveState === 'go') {
        if (State.lastDirKey === 'none') {
            if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(this.direction) === false) ) {
              this.moveState = 'stop';
              State.lastDirKey = 'none';
              this.hopToIn();
            } else {
              let pill = this.tryEatPill();
              if (pill === 'B') { myGame.startGhostFleeState(); }
              this.movePac();
              this.nextMouth();
            }
        } else if (State.lastDirKey !== 'none') {
          if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(State.lastDirKey) === true) ) {
            this.hopToIn();
            this.changeDir(State.lastDirKey);
            State.lastDirKey = 'none';
          } else if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(this.direction) === false) ) {
            this.moveState = 'stop';
            State.lastDirKey = 'none';
            this.hopToIn();
          } else {
            let pill = this.tryEatPill();
            if (pill === 'B') { myGame.startGhostFleeState(); }
            this.movePac();
            this.nextMouth();
          }
        } else {
          console.log("[lastDirKey problems]");
        }
    } else if (this.moveState === 'paused') {
        // check to see if it's time to resume movement after an intersection
        if (this.tmpPauseState === true) {
          if ((performance.now() - this.tmpPauseBegin) > this.tmpPauseDur) {
            this.tmpUnpause();
          }
        }
    } else if (this.moveState === 'stop') {
        if (State.lastDirKey !== 'none') {
          if (this.inBounds(State.lastDirKey) === true) {
            this.moveState = "go";
            this.changeDir(State.lastDirKey);
            State.lastDirKey = 'none';
            let pill = this.tryEatPill();
            if (pill === 'B') { myGame.startGhostFleeState(); }
            this.movePac();
            this.nextMouth();
          }
        } else {
          // lastDirKey is nothing so just sit at the intersection and wait for user input
        }
    } else if (this.moveState === 'dying1') {
        if (this.deathMouthAnimFinished === false) {
          this.nextDeathMouth();
        } else if (this.deathMouthAnimFinished === true) {
          this.initDeathSparkles();
        } else {
          console.log('deathMouthAnimFinished probs');
        }
    } else if (this.moveState === 'dying2') {
        if ((performance.now() - this.deathSparklesStart) > this.deathSparklesDur) {
          myGame.softReset();
        } else {
          this.nextDeathSparkle();
        }
    } else {
        console.log("[move state problems]");
    }
  }; // update

} // PAC
