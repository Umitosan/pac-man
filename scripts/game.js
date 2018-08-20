/* jshint esversion: 6 */


function Game(updateDur) {
  this.paused = false;
  this.myPac = undefined;
  this.myLevel = undefined;
  this.ghosts = [];
  this.score = 0;
  this.updateDuration = updateDur;  // milliseconds duration between update()
  this.lastUpdate = 0;
  this.timeGap = 0;
  this.lastKey = 0;
  this.gridOn = false;
  this.pxBoxOn = false;

  this.pausedTxt = undefined;
  this.readyTxt = undefined;
  this.gameoverTxt = undefined;
  this.currentTxt = undefined;

  this.bigPillEffect = false;
  this.bigPillEffectDur = 8000; // milliseconds
  this.bigPillEffectDurElapsed = 0; // milliseconds elapsed for effect, used mainly when pausing the game
  this.bigPillEffectStart = null; // exact time effect started
  this.bigPillGhostsEaten = 0;  // total ghosts eaten this pill period
  this.startGhostsBlinkingStarted = false; // toggle ghosts blinking just once

  // scatter
  this.scatterOn = false;
  this.scatterTimer = undefined;
  this.scatterStartTime = undefined;
  this.scatterDuration = 4;  // # of seconds the ghosts will scatter for
  this.scatterCount = 4; // scatter has a max of 4 times per lvl after which ghosts only chase

  this.gameover = false;

  this.init = function() {
    let spacing = State.gridSpacing;
    // Pac(x,y,velocity,width,direction,moveState)
    this.myPac = new Pac( /* x */             (14*spacing)+(spacing/2),
                          /* y */             24*spacing,
                          /* velocity */      3,
                          /* direction */     'right',
                          /* moveState */     'stop'
                        );
    // init ghosts
    this.myPac.init();
    this.updateLives();
    this.myLevel = new Level(3);
    this.myLevel.init();
    this.ghosts.push(new Ghost( /*   x   */  spacing*14+(spacing/2),
                                /*   y   */  spacing*12,
                                /* name  */  "blinky",
                                /* src   */  'img/blinky.png',
                                /*frame0 */  2,
                                /*mvState*/  'chase',
                                /* dir   */  'left',
                                /* dots  */  0,
                                /* allow */ true
                              ));
    this.ghosts.push(new Ghost( /*   x   */  spacing*14+(spacing/2),
                                /*   y   */  spacing*15,
                                /* name  */  "pinky",
                                /* src   */  'img/pinky.png',
                                /*frame0 */  2,
                                /*mvState*/  'exitbase',
                                /* dir   */  'up',
                                /* dots  */  0,
                                /* allow */ true
                              ));
    this.ghosts.push(new Ghost( /*   x   */  spacing*13-(spacing/2),
                                /*   y   */  spacing*15,
                                /* name  */  "inky",
                                /* src   */  'img/inky.png',
                                /*frame0 */  2,
                                /*mvState*/  'chillbase',
                                /* dir   */  'down',
                                /* dots  */  30,
                                /* allow */ false
                              ));
    this.ghosts.push(new Ghost( /*   x   */  spacing*16+(spacing/2),
                                /*   y   */  spacing*15,
                                /* name  */  "clyde",
                                /* src   */ 'img/clyde.png',
                                /*frame0 */  2,
                                /*mvState*/  'chillbase',
                                /* dir   */  'down',
                                /* dots  */  60,
                                /* allow */ false
                              ));
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].init();
    }
    this.pausedTxt = new TxtBox(/* x     */ spacing*15-10,
                                /* y     */ spacing*19-10,
                                /* msg   */ 'PAUSED',
                                /* color */ Colors.pacYellow,
                                /* dur   */ 2000,
                                /* font  */ '42px joystix'
                              );
    this.readyTxt = new TxtBox( /* x     */ spacing*15-10,
                                /* y     */ spacing*19-10,
                                /* msg   */ 'READY!',
                                /* color */ Colors.pacYellow,
                                /* dur   */ 2000,
                                /* font  */ '42px joystix'
                              );
    this.gameoverTxt = new TxtBox(/* x     */ spacing*15-10,
                                  /* y     */ spacing*19-10,
                                  /* msg   */ 'GAME OVER!',
                                  /* color */ Colors.pacYellow,
                                  /* dur   */ 2000,
                                  /* font  */ '42px joystix'
                              );
    this.currentTxt = this.readyTxt;
    this.currentTxt.startTimer(); // turn on the ready txt
  };

  this.newLifeReset = function() {
    console.log('game newLifeReset');
    this.myPac.softReset();
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].softReset();
    }
    this.readyTxt.show = true;
    setTimeout( () => { this.readyTxt.show = false; },2000);
    clearCanvas();
  };

  this.gameOverInit = function() {
    // game over screen
    // game over txt
    // maybe game over animation
    // final score etc game summary, play again?
    // firebase high scores?
    console.log("GAME OVER SON!");
    this.gameover = true;
    this.myPac.moveState = 'gameover';
    this.ghosts.forEach(function(g) {
      g.moveState = 'gameover';
    });
    this.myPac.moveState = 'gameover';
    // TxtBox(x,y,msg,color,dur,font)
    this.currentTxt = this.gameoverTxt;
    this.currentTxt.on();
    console.log('myGame = ', State.myGame);
  };

  this.updateLives = function() { // update the number of pac life images below game
    $( "div.bonus-row").children().css('background-image','none');
    for (var i = 1; i < this.myPac.lives+1; i++) {
      $( "div.bonus-row").children('#life'+i).css('background-image','url(img/pac.png)');
    }
  };

  this.resetUpdateGap = function() {
    this.timeGap = 0;
    this.lastUpdate = 0;
  };

  this.updatePlayTime = function() {
    State.playTime += (performance.now() - State.playTimeMarker);
    State.playTimeMarker = performance.now();
    let roundedPlayTime = Math.floor(State.playTime / 1000);
    $('#clock').text(roundedPlayTime);
  };

  this.updateScore = function(lvlChar) {
    if (lvlChar === 0) {
      this.score += 10;
      $('#score').text(this.score);
    } else if (lvlChar === 'B') {
      this.score += 50;
      $('#score').text(this.score);
    } else if (lvlChar === 'G') { // ghost eaten
      this.score += Math.pow(2,this.bigPillGhostsEaten)*100;
      $('#score').text(this.score);
    } else {
      console.log('updateScore problems, char is = ', lvlChar);
    }
  };

  this.startGhostFleeState = function() {  // pac initiates this when he eats a big pill, @(pac.update)
    console.log('start ghost flee state');
    for (let i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].tryStartFlee();
    }
    this.bigPillGhostsEaten = 0;
    this.bigPillEffect = true;
    this.bigPillEffectStart = performance.now();
  };

  this.stopGhostFleeState = function() {
    console.log('stop ghost flee state');
    for (let i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].stopFlee();
    }
    this.bigPillGhostsEaten = 0;
    this.bigPillEffect = false;
    this.bigPillEffectStart = null;
  };

  this.checkScatterTime = function() {
    if ( (!this.scatterOn) && (this.scatterCount !== 0) ) {
      let timeRound = Math.round(State.playTime / 1000);
      if ( ((timeRound % 10) === 0) && (timeRound > 9) ) { // prevent scatter in first 19 sec
        // console.log("timeRound = " , timeRound);
        this.startGhostsScatterState();
      }
    } else if (this.scatterOn) { // check to see if it's time to turn it off
        let timeSinceScatter = Math.round( (performance.now() - this.scatterStartTime) / 1000 );
        // console.log("timeSinceScatter = ", timeSinceScatter);
        if ( timeSinceScatter >= this.scatterDuration ) {
          // console.log("(performance.now() - this.scatterStartTime) = ", (performance.now() - this.scatterStartTime)/1000 );
          this.stopGhostsScatterState();
        }
    } else {
      // nothin
    }
  };

  this.startGhostsScatterState = function() {
      console.log('start - scatter');
      this.scatterStartTime = performance.now();
      this.scatterOn = true;
      this.scatterCount--;
      console.log(this.scatterCount+" scatters left");
      this.ghosts.forEach( function(g) {
        g.startScatter();
      });
  };

  this.stopGhostsScatterState = function() {
      console.log('game.stopGhostsScatterState');
      this.scatterStartTime = undefined;
      this.scatterOn = false;
      this.ghosts.forEach( function(g) {
        g.tryStopScatter();
      });
  };

  this.startGhostsBlinking = function() {
    for (let i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].startBlinking();
    }
  };

  this.pauseAllChars = function(pauseDur) {  // runs a tmp pause on pac and ghosts
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].timedPause(pauseDur);
    }
    this.myPac.timedPause(pauseDur);
  };

  this.stopAllGhosts = function() {
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].moveState = 'stop';
    }
  };

  this.pauseIt = function() {
    console.log('GAME paused');
    State.pauseStartTime = performance.now();
    this.paused = true;
    this.pausedTxt.on();
    if (this.bigPillEffect === true) {
      this.bigPillEffectDurElapsed = (performance.now() - this.bigPillEffectStart);
    }
  };

  this.unpauseIt = function() {
    console.log('GAME un-paused');
    this.paused = false;
    this.pausedTxt.off();
    if (this.bigPillEffect === true) {
      this.bigPillEffectStart = performance.now(); // set new effect start to accurately measure time elapsed for effect
    }
    // this prevents pac from updating many times after UNpausing
    this.lastUpdate = performance.now();
    State.playTimeMarker = performance.now();
    this.timeGap = 0;
  };

  this.drawGrid = function() {
    let canvas = State.canvas;
    let spacing = State.gridSpacing;
    for (let i = 0; i < State.gridWidth+2; i++) {
      // function drawLine(x1,y1,x2,y2,width,color)
      drawLine(i*spacing,0,i*spacing,canvas.height,1,'green');
    }
    for (let i = 0; i < State.gridHeight+2; i++) {
      drawLine(0,i*spacing,canvas.width,i*spacing,1,'green');
    }
  };

  this.draw = function() {
    if (this.lvlOnType !== 0) this.myLevel.draw();
    if (!this.gameover) {
      if (this.gridOn) this.drawGrid();
      if (this.ghosts.length > 0) {
        for (let g = 0; g < this.ghosts.length; g++ ) {
          this.ghosts[g].draw();
        }
      }
      if (this.myPac) this.myPac.draw();
      if (this.pausedTxt.show === true) this.pausedTxt.draw();
    } else { // game over
      if (this.currentTxt.show === true) this.currentTxt.draw();
    }
  };

  this.update = function() {

    if ( (!this.paused) && (!this.gameover) ){ // performance based update: this.update() runs every this.updateDuration milliseconds

          if (State.playTime < 1) { // make sure on first update() only run once
            this.lastUpdate = performance.now();
            this.timeGap = 0;
          } else {
            this.timeGap = performance.now() - this.lastUpdate;
          }

          if ( this.timeGap >= this.updateDuration ) {
            let timesToUpdate = this.timeGap / this.updateDuration;
            for (let i=1; i < timesToUpdate; i++) {
              this.myPac.update();
              if ( this.currentTxt.show && (this.currentTxt.startTime !== null) ) { this.currentTxt.update(); }
              for (let g=0;g < this.ghosts.length; g++ ) {
                this.ghosts[g].update();
              }
            }
            this.lastUpdate = performance.now();
          }

          if (this.bigPillEffect === true) {
            if ((performance.now() - this.bigPillEffectStart + this.bigPillEffectDurElapsed) > this.bigPillEffectDur) {
              this.stopGhostFleeState();
              this.startGhostsBlinkingStarted = false; // reset to use later
              this.bigPillEffectDurElapsed = 0;
            } else if ( ((performance.now() - this.bigPillEffectStart + this.bigPillEffectDurElapsed) > 5000) && (this.startGhostsBlinkingStarted === false) ) {
              // blink ghosts for last 3 seconds of Flee
              // only run this once the first time
              this.startGhostsBlinking();
              this.startGhostsBlinkingStarted = true;
            }
          }
          this.updatePlayTime();
          this.checkScatterTime();
    } else if ( (this.paused === true) && (!this.gameover) ) {
      // chill
    } else if (this.gameover) {
      // chill
    } else {
      console.log('unhandeled game update case');
    }

  }; // game update
}
