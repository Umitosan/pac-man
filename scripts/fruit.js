/* jshint esversion: 6 */


function FruitGroup() {
  this.dx = undefined;
  this.dy = undefined;
  this.img = undefined;
  this.show = false;
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
  this.totalDur = 3000;
  this.pauseBegin = undefined;
  this.pauseElapsedTime = 0;

  this.init = function(someSrc) {
    let spacing = State.gridSpacing;
    let someImg = new Image();
    someImg.src = someSrc;
    this.img = someImg;
    this.dx = (spacing*13)+(spacing/2);
    this.dy = (spacing*17)+2;
  };

  this.start = function() {
    this.startTime = performance.now();
  };

  this.pauseIt = function() {
    this.pauseElapsedTime = (performance.now() - this.pauseBegin);
  };

  this.unpauseIt = function() {
    this.pauseBegin = (performance.now() - this.pauseElapsedTime);
  };

  this.finish = function() {
    this.pauseBegin = undefined;
    this.show = false;
  };

  this.draw = function() {
    if (this.show === true) {
      let ctx = State.ctx;
      let spacing = State.gridSpacing;
      // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
      ctx.drawImage(  /*image*/   this.img,
                      /* dx */    this.dx,
                      /* dy */    this.dy,
                      /*dWidth*/  spacing*2-6,
                      /*dHidth*/  spacing*2-6
      );
    } // end if
  };

  this.update = function() {
    if (this.pauseElapsedTime > this.totalDur) {
      this.finish();
    } else {
      this.pauseElapsedTime = (performance.now() - this.pauseBegin);
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
