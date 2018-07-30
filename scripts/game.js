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
  this.currentTxt = undefined;

  this.bigPillEffect = false;
  this.bigPillEffectDur = 8000; // milliseconds
  this.bigPillEffectDurElapsed = 0; // milliseconds elapsed for effect, used mainly when pausing the game
  this.bigPillEffectStart = null; // exact time effect started
  this.bigPillGhostsEaten = 0;  // total ghosts eaten this pill period
  this.startGhostsBlinkingStarted = false; // toggle ghosts blinking just once

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
    this.currentTxt = this.readyTxt;
    this.currentTxt.startTimer(); // turn on the ready txt
  };

  this.softReset = function() {
    console.log('game softReset');
    this.myPac.softReset();
    for (var i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].softReset();
    }
    this.readyTxt.show = true;
    setTimeout( () => { this.readyTxt.show = false; },2000);
    clearCanvas();
  };

  this.updateLives = function() { // update the number of pac life images below game
    $( "div.bonus-row").children().css('background-image','none');
    for (var i = 1; i < myGame.myPac.lives+1; i++) {
      $( "div.bonus-row").children('#life'+i).css('background-image','url(img/pac.png)');
    }
  };

  this.resetUpdateGap = function() {
    this.timeGap = 0;
    this.lastUpdate = 0;
  };

  this.updatePlayTime = function() {
    State.playTime = performance.now() - State.playStart;
    let roundedPlayTime = Math.floor(State.playTime / 1000);
    $('#clock').text(roundedPlayTime);
  };

  this.updateScore = function(lvlChar) {
    if (lvlChar === 0) {
      this.score += 10;
      $('#score').text(myGame.score);
    } else if (lvlChar === 'B') {
      this.score += 50;
      $('#score').text(myGame.score);
    } else if (lvlChar === 'G') { // ghost eaten
      this.score += Math.pow(2,myGame.bigPillGhostsEaten)*100;
      $('#score').text(myGame.score);
    } else {
      console.log('updateScore problems, char is = ', lvlChar);
    }
  };

  this.startGhostFleeState = function() {  // pac initiates this when he eats a big pill, @(pac.update)
    console.log('start ghost flee state');
    for (let i = 0; i < this.ghosts.length; i++) {
      this.ghosts[i].startFlee();
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
    myGame.paused = true;
    this.pausedTxt.on();
    if (this.bigPillEffect === true) {
      this.bigPillEffectDurElapsed = (performance.now() - this.bigPillEffectStart);
    }
  };

  this.unpauseIt = function() {
    console.log('GAME un-paused');
    myGame.paused = false;
    this.pausedTxt.off();
    if (this.bigPillEffect === true) {
      this.bigPillEffectStart = performance.now(); // set new effect start to accurately measure time elapsed for effect
    }
    // this prevents pac from updating many times after UNpausing
    this.lastUpdate = performance.now();
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
    if (myGame.gridOn) myGame.drawGrid();
    if (this.lvlOnType !== 0) this.myLevel.draw();
    if (this.ghosts.length > 0) {
      for (let g = 0; g < this.ghosts.length; g++ ) {
        this.ghosts[g].draw();
      }
    }
    if (this.myPac) this.myPac.draw();
    if (this.pausedTxt.show === true) this.pausedTxt.draw();
    if (this.readyTxt.show === true) this.readyTxt.draw();
  };

  this.update = function() {

    if (!this.paused) { // performance based update: myGame.update() runs every myGame.updateDuration milliseconds

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
    } else if (this.paused === true) {
      // do nothin
    } else {
      console.log('game pause issue');
    }

  }; // game update
}
