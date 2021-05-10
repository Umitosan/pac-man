/* jshint esversion: 6, asi: true */

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
  this.moveState = moveState; // go, stop, tpaused, dying1, dying2, lvlchange, gameover
  this.lastMoveState = 'tpaused';
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
  this.timedPauseState = false;
  this.timedPauseBegin = null;
  this.timedPauseDur = 0;

  // sounds
  this.runSoundOn = false;

  this.init = function() {
    this.timedPause(2000);
  }; // init

  this.softReset = function() { // reset pac to original valuse
    if (LOGS) console.log('pac softReset');
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
    this.lastMoveState = 'tpaused';
    State.lastDirKey = 'none';
    this.moveState = 'stop';
    this.runSoundOn = false;
    State.myGame.sounds.dots.stop();
    this.timedPause(2000);
  };

  this.timedPause = function(dur) {
    this.timedPauseState = true;
    this.timedPauseDur = dur;
    this.timedPauseBegin = performance.now();
    this.lastMoveState = this.moveState;
    this.moveState = 'tpaused';
  };

  this.tmpUnpause = function() {
    this.timedPauseState = false;
    this.timedPauseDur = 0;
    this.timedPauseBegin = null;
    this.moveState = this.lastMoveState;
    this.lastMoveState = 'tpaused';
  };

  this.inBounds = function(tDir) {
    let bounds = 'none';
    let sp = State.gridSpacing;
    let off = this.vel;

    switch (true) {
      case ( (tDir === 'left') && ( getNearestIntersection(this.x-sp+off,this.y).char === "#") ):
        // if (LOGS) console.log("LEFT bounds hit ", getNearestIntersection(x-sp+off,y) );
        bounds = false;  break;
      case ( (tDir === 'right') && ( getNearestIntersection(this.x+sp-off,this.y).char === "#") ):
        // if (LOGS) console.log("RIGHT bounds hit ", getNearestIntersection(x+sp-off,y) );
        bounds = false;  break;
      case ( (tDir === 'up') && ( getNearestIntersection(this.x,this.y-sp+off).char === "#") ):
        // if (LOGS) console.log("UP bounds hit ", getNearestIntersection(x,y-sp+off) );
        bounds = false;  break;
      case ( (tDir === 'down') && (( getNearestIntersection(this.x,this.y+sp-off).char === "#") || ( getNearestIntersection(this.x,this.y+sp-off).char === "W")) ):
        // if (LOGS) console.log("DOWN bounds hit ", getNearestIntersection(x,this.y+sp-off) );
        bounds = false;  break;
      default:
        // if (LOGS) console.log('no bounds hit, keep going fwd');
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
      if (LOGS) console.log(' changeDir problems ');
    }
    this.moveState = 'go';
  };

  this.movePac = function() {
    let canvas = State.canvas;
    let spacing = State.gridSpacing;
    let edgeGap = 10;
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      if ((this.x+this.vel) > (canvas.width-edgeGap)) {  // handle the TUNNEL
        this.x = edgeGap*2;
      } else if ((this.x+this.vel) < edgeGap) {
        this.x = canvas.width-(edgeGap*2);
      } else {
        this.x += this.vel;
      }
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      this.y += this.vel;
    } else {
      if (LOGS) console.log(' move pac problems ');
    }
    if ( (this.runSoundOn === false) && (State.soundsOn) ) { // turn the waka waka on if pac just now starting to move
      this.runSoundOn = true;
      State.myGame.sounds.dots.play();
    }
  }; //move

  this.rotatePacFace = function() {
    // if (LOGS) console.log("rotatePacFace");
    switch ( this.direction )  {
      case 'left':  this.rotateFace = Math.PI;  break;
      case 'right':  this.rotateFace = 0;  break;
      case 'up':  this.rotateFace = Math.PI*3/2;  break;
      case 'down':  this.rotateFace = Math.PI/2;  break;
      case 'stop': if (LOGS) console.log("stopped");  break;
      default:
        if (LOGS) console.log("rotatePacFace broke");
        break;
    } // end switch
  };

  this.hopToIn = function() {
    let spacing = State.gridSpacing;
    let data = getNearestIntersection(this.x,this.y);
    this.x = (data.col+1)*spacing;
    this.y = (data.row+1)*spacing;
  };

  this.tryEatPill = function() {
    let data = getNearestIntersection(this.x,this.y);
    let pillType = 'not pill';
    if ( (data.char === 0) || (data.char === 'B') ) {
      pillType = data.char;
      State.myGame.updateScore(data.char);
      State.myGame.myLevel.currentLevel[data.row][data.col] = '-';
      State.myGame.ghosts[2].updateDotsCounter(); // update inky
      State.myGame.ghosts[3].updateDotsCounter(); // update clyde
      let dotsTotal = State.myGame.myLevel.countDots();
      if (dotsTotal < 1) { // level complete!
        State.myGame.levelCompleteInit(); // prepare for the next level
      } else if (dotsTotal === (244-70)) {  // (244-70) first fruit appears
        State.myGame.myFruit.start();
      } else if (dotsTotal === (244-170)) {  // (244-170) second fruit appears
        State.myGame.myFruit.start();
      } else {
        // nottin
      }
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
    if (LOGS) console.log('pac die');
    this.moveState = 'dying1';
    State.myGame.stopAllGhosts();
    this.timedPause(200);
    this.direction = 'up';
    this.rotatePacFace();
    this.mouthVel = getRadianAngle(3);
    this.mouthSize = getRadianAngle(20);
    this.lives -= 1;
    if (LOGS) console.log('pac lives left: ', this.lives);
    State.myGame.updateLives();
    State.myGame.scatterCount = 4; // reset the scatter counter
    if (LOGS) console.log('pac movestate = ', this.moveState);
    State.myGame.pauseAllSounds();
    State.myGame.sounds.pdeath.play();
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
      if (LOGS) console.log('mouth death done');
      this.deathMouthAnimFinished = true;
    } else { // animate the pac mouth death
      this.mouthSize += this.mouthVel;
    }
  };

  this.initDeathSparkles = function() {
    if (LOGS) console.log('initDeathSparkles');
    let getRII = getRandomIntInclusive;
    this.moveState = 'dying2';
    this.deathSparklesStart = performance.now();
    for (var i = 0; i < 600; i++) {
      let randX =  this.x + getRII(-15,15);
      let randY =  this.y + getRII(-15,15);
      let randLen =  getRII(10,30);
      let randAngle = getRII(1,360);
      let randVel = getRII(2,5) / 30;
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
      if (LOGS) console.log('pixTestFront issues');
    }
    this.pixX = (this.x+((this.lineW+this.radius+2)*xCoef));
    this.pixY = (this.y+((this.lineW+this.radius+2)*yCoef));
    let pxData =  State.ctx.getImageData(this.pixX, this.pixY, 1, 1).data;
    let pxRgba = 'rgba('+pxData[0]+','+pxData[1]+','+pxData[2]+','+pxData[3]+')';
    return { data: pxData,
             rgbastr: pxRgba };
  };

  this.drawPixTestBox = function() {
    let ctx = State.ctx;
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.rect(this.pixX-5,this.pixY-5,10,10);
    ctx.stroke();
    $('.pixel-window').css( 'background-color', this.pixTest(this.direction).rgbastr );
  };

  this.draw = function() {
    let ctx = State.ctx;

    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    if (this.moveState === 'dying2') { // make the beautiful sparkles happen!
      let dSpark = this.deathSparkles;
      for (let i = 0; i < dSpark.length; i++) {
        ctx.beginPath();
        ctx.lineWidth = getRandomIntInclusive(1,12);
        ctx.strokeStyle = dSpark[i].color;
        // ctx.strokeStyle = randColor('rgba'); // full random color madness
        let x = dSpark[i].x;
        let y = dSpark[i].y;
        let angle = dSpark[i].angle;
        let len = dSpark[i].len;
        // single ray
        ctx.moveTo( x , y );
        ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
        ctx.stroke();
      }
    } else if (this.moveState === 'lvlchange') {
      // don't draw pac
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
    if (State.myGame.pxBoxOn) { this.drawPixTestBox(); }
  }; // draw

  this.update = function() {
    let mState = this.moveState;
    if (mState === 'go') {
        if (State.lastDirKey === 'none') { // Going forward, NO KEY input
            if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(this.direction) === false) ) {
              this.moveState = 'stop';
              State.lastDirKey = 'none';
              this.hopToIn();
            } else {
              if (this.tryEatPill() === 'B') { State.myGame.startGhostFleeState(); }
              this.movePac();
              this.nextMouth();
            }
        } else if (State.lastDirKey !== 'none') { // Going forward, KEY pressed
          let lastKey = State.lastDirKey;
          if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(lastKey) === true) ) {
            this.hopToIn();
            this.changeDir(lastKey);
            State.lastDirKey = 'none';
            this.movePac();
            this.movePac(); // multiple moves at once when PAC rounds a corner, this creates a speed up effect like the original game
          } else if ( atGridIntersection(this.x,this.y,this.vel) && (this.inBounds(this.direction) === false) ) {
            this.moveState = 'stop';
            State.lastDirKey = 'none';
            this.hopToIn();
          } else {
            if (this.tryEatPill() === 'B') { State.myGame.startGhostFleeState(); }
            this.movePac();
            this.nextMouth();
          }
        } else {
          if (LOGS) console.log("[lastDirKey problems]");
        }
    } else if (mState === 'tpaused') {
        // check to see if it's time to resume movement after an intersection
        if (this.timedPauseState === true) {
          if ((performance.now() - this.timedPauseBegin) > this.timedPauseDur) {
            this.tmpUnpause();
          }
        }
    } else if (mState === 'stop') {
        let lastKey = State.lastDirKey;
        if (lastKey !== 'none') {
          if (this.inBounds(lastKey) === true) {
            this.moveState = "go";
            this.changeDir(lastKey);
            State.lastDirKey = 'none';
            let pill = this.tryEatPill();
            if (pill === 'B') { State.myGame.startGhostFleeState(); }
            this.movePac();
            this.nextMouth();
          }
        } else {
          // lastDirKey is nothing so just sit at the intersection and wait for user input
        }
        if (this.runSoundOn === true) {
          this.runSoundOn = false;
          State.myGame.sounds.dots.stop();
        }
    } else if (mState === 'dying1') {
        if (this.deathMouthAnimFinished === false) {
          this.nextDeathMouth();
        } else if (this.deathMouthAnimFinished === true) {
          this.initDeathSparkles();
        } else {
          if (LOGS) console.log('deathMouthAnimFinished probs');
        }
    } else if (mState === 'dying2') {
        if ((performance.now() - this.deathSparklesStart) > this.deathSparklesDur) {
          if (this.lives === -1) { // game over
            State.myGame.gameOverInit();
          } else { // game continues to new life after pac's animation has completed
            State.myGame.newLifeReset();
          }
        } else {
          this.nextDeathSparkle();
        }
    } else if (mState === 'lvlchange') {
      // chill
    } else if (mState === 'gameover') {
      // show gameover animation
    } else {
        if (LOGS) console.log("[move state problems]");
    }
  }; // update

} // PAC
