/* jshint esversion: 6 */


function FruitGroup() {
  this.dx = undefined;
  this.dy = undefined;
  this.dWidth = undefined;
  this.dHeight = undefined;
  this.img = undefined;
  this.show = false;
  this.eaten = false;
  this.eatenTxtBox = undefined;
  this.pointsList = { 'cherry':     100,
                      'strawberry': 300,
                      'orange':     500,
                      'apple':      700,
                      'melon':      1000,
                      'glaxian':    2000,
                      'bell':       3000,
                      'key':        5000
  };

  // timing
  this.startTime = undefined;
  this.totalDur = 6000;
  this.pauseBegin = undefined;
  this.pauseElapsedTime = 0;

  this.init = function(someSrc) {
    let spacing = State.gridSpacing;
    let someImg = new Image();
    this.eaten = false;
    someImg.src = someSrc;
    this.img = someImg;
    this.dx = (spacing*13)+(spacing/2);
    this.dy = (spacing*17);
    this.dWidth = spacing*2;
    this.dHeight = spacing*2;
    let x = this.dx+25;
    let y = this.dy+25+5;
    this.eatenTxtBox =  new TxtBox(/* x     */ x,
                                   /* y     */ y,
                                   /* msg   */ '100',
                                   /* color */ Colors.ghostAqua,
                                   /* dur   */ 7000,
                                   /* font  */ '20px joystix'
                                 );
  };

  this.start = function() {
    console.log('start happened');
    this.startTime = performance.now();
    this.show = true;
  };

  this.pauseIt = function() {
    this.pauseElapsedTime = (performance.now() - this.pauseBegin);
  };

  this.unpauseIt = function() {
    this.pauseBegin = (performance.now() - this.pauseElapsedTime);
  };

  this.checkPacCollision = function() {
    // console.log('dist y = ', Math.abs(State.myGame.myPac.y - this.dy - 25));
    // console.log('dist x = ', Math.abs(State.myGame.myPac.x - this.dx + 25));
    if ( (this.show === true) && (Math.abs(State.myGame.myPac.y - this.dy - 25) < 10) && (Math.abs(State.myGame.myPac.x - this.dx - 25) < 10) ) {  // 25 is to offset fruit draw corner
      // pac eats fruit
      this.eaten = true;
      this.finish();
    }
  };

  this.finish = function() {
    console.log('fruit duration complete');
    this.pauseBegin = undefined;
    this.startTime = undefined;
    this.pauseElapsedTime = 0;
    this.show = false;
    if (this.eaten === true) { // this.eaten bug: text remebers being eaten first time and shows even not when eaten again second time
      this.eatenTxtBox.startTimer();
    }
    // update score
    State.myGame.updateScore("F",this.pointsList.cherry);
  };

  this.draw = function() {
    if (this.show === true) {
      let ctx = State.ctx;
      let spacing = State.gridSpacing;
      // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.drawImage(  /*image*/    this.img,
                      /* dx */     this.dx,
                      /* dy */     this.dy,
                      /*dWidth*/   this.dWidth,
                      /*dHeidth*/  this.dHeight
      );
      // placeholder box
      // ctx.beginPath();
      // ctx.strokeStyle = 'white';
      // ctx.strokeWidth = 1;
      // ctx.fillStyle = 'black';
      // ctx.rect(this.dx+25,this.dy+25,5,5); // x y width height
      // ctx.rect(this.dx,this.dy,this.dWidth,this.dHeight); // x y width height
      // ctx.stroke();
    } // end if
    if (this.eatenTxtBox.show === true) {
      this.eatenTxtBox.draw();
    }
  };

  this.update = function() {
    // timing
    if (this.startTime !== undefined) {
        if (this.pauseBegin !== undefined) {  // paused so check pause stuff
            if (this.pauseElapsedTime > this.totalDur) {
              this.finish();
            } else {
              this.pauseElapsedTime = (performance.now() - this.pauseBegin);
            }
        } else { // not paused so udpate duration passed
          if ( (performance.now() - this.startTime + this.pauseElapsedTime) > this.totalDur ) {
            this.finish();
          }
        } // if
    } // if
    this.checkPacCollision();
    // update eaten text
    if (this.eatenTxtBox.show === true) {
      this.eatenTxtBox.update();
    }
  };

}


/*  NOTES

🍒 Cherry: 100 points.
🍓 Strawberry: 300 points
🍊 Orange: 500 points
🍎 Apple: 700 points
🍈 Melon: 1000 points
PM Galaxian Galaxian Boss: 2000 points
🔔 Bell: 3000 points
🔑 Key: 5000 points

 - two pieces of fruit which appear during each level near the middle of the maze.
 - The first fruit appears when Pac-Man has eaten 70 of the dots in the maze, and the
      - second when 170 have been eaten.

      The second way to increase your score each round is by eating the bonus symbols (commonly known as fruit) that appear
          directly below the monster pen twice each round for additional points. The first bonus fruit appears
             after 70 dots have been cleared from the maze; the second one appears after 170 dots are cleared.

      Each fruit is worth anywhere from 100 to 5,000 points, depending on what level the player is currently on.
         Whenever a fruit appears, the amount of time it stays on the screen before disappearing is always between
           nine and ten seconds. The exact duration (i.e., 9.3333 seconds, 10.0 seconds, 9.75 seconds, etc.)
             is variable and does not become predictable with the use of patterns. In other words,
               executing the same pattern on the same level twice is no guarantee for how long the bonus fruit will stay
                 onscreen each time.

      This usually goes unnoticed given that the majority of patterns are designed to eat the bonus fruit as quickly as possible after it has been triggered to appear. The symbols used for the last six rounds completed, plus the current round are also shown along the bottom edge of the screen (often called the fruit counter or level counter). See Table A.1 in the appendices for all bonus fruit and scoring values, per level.



*/
