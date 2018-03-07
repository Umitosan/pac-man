/*jshint esversion: 6 */

// original 1980s dimentions
// width: 38 tiles wide - 26 dots + 2 tiles of edge
// height: 31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="676" height="751"

// sample level image
// http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png


///////////////////
// GAME
///////////////////

var CANVAS = undefined;
var ctx = undefined;
var myGame = undefined;

var State = {
  loopRunning: false,
  gameStarted: false,
  myReq: undefined,
  playTime: 0,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS we want to allow
  pageLoadTime: 0,
  frameCounter: 0,
  gridSpacing: 25, // dimentions of grid in pixels
  gridWidth: 28,
  gridHeight: 31,
  lastDirKey: 'none'
};

function Game(updateDur) {
  this.paused = true;
  this.bg = new Image();
  this.myPac = undefined;
  this.myLevel = new Level();
  this.ghosts = undefined;
  this.updateDuration = updateDur;  // milliseconds duration between update()
  this.lastUpdate = 0;
  this.timeGap = 0;
  this.lastKey = 0;
  this.gridOn = false;
  this.lvlOn = true;
  this.pxBoxOn = false;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,velocity,width,faceDirection,moveState)
    this.myPac = new Pac( /* x */             (14*State.gridSpacing)+(State.gridSpacing/2),
                          /* y */             24*State.gridSpacing,
                          /* velocity */      3,
                          /* width */         (State.gridSpacing*2+2)-12,
                          /* faceDirection */ 'right',
                          /* moveState */     'stop'
                        );
    // init ghosts
    this.myPac.init();
    this.myLevel.init();
  };
  this.drawGrid = function() {
    for (let i = 0; i < State.gridWidth+2; i++) {
      // function drawLine(x1,y1,x2,y2,width,color)
      drawLine(i*State.gridSpacing,0,i*State.gridSpacing,CANVAS.height,1,'green');
    }
    for (let i = 0; i < State.gridHeight+2; i++) {
      drawLine(0,i*State.gridSpacing,CANVAS.width,i*State.gridSpacing,1,'green');
    }
  };
  this.drawBG = function() {
    ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
  };
  this.draw = function() {
    if (myGame.gridOn) myGame.drawGrid();
    if (this.lvlOn) this.myLevel.draw();
    if (this.myPac) this.myPac.draw();
  };
  this.update = function() {
    // performance based update: myGame.update() runs every myGame.updateDuration milliseconds
    this.timeGap = performance.now() - this.lastUpdate;
    if ( this.timeGap >= this.updateDuration ) {
      let timesToUpdate = this.timeGap / this.updateDuration;
      // console.log('timesToUpdate = ', timesToUpdate);
      for (let i=1; i < timesToUpdate; i++) {
        this.myPac.update();
      }
      this.lastUpdate = performance.now();
    }
  };
}


//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  if ( (State.loopRunning) && (State.gameStarted) ) { myGame.update();  }

  clearCanvas();
  if (!State.gameStarted) {
    myGame.drawBG();
  } else {
    myGame.draw();
  }

}

//////////////////////////////////////////////////////////////////////////////////
// KEYBINDINGS
//////////////////////////////////////////////////////////////////////////////////
function keyDown(event) {
    event.preventDefault(); // prevents page from scrolling within window frame
    myGame.lastKey = event.keyCode;
    let code = event.keyCode;
    switch (code) {
        case 37: // Left key
          if (myGame.myPac.direction !== 'left') {
            State.lastDirKey = 'left';
          }
          break;
        case 39: //Right key
          if (myGame.myPac.direction !== 'right') {
            State.lastDirKey = 'right';
          }
          break;
        case 38: // Up key
          if (myGame.myPac.direction !== 'up') {
            State.lastDirKey = 'up';
          }
          break;
        case 40: //Down key
          if (myGame.myPac.direction !== 'down') {
            State.lastDirKey = 'down';
          }
          break;
        case 32: // spacebar
          myGame.myPac.togglePacGo();
          break;
        case 71: // G key
          console.log('toggle grid');
          (myGame.gridOn) ? (myGame.gridOn = false) : (myGame.gridOn = true);
          break;
        case 68: // D key
          console.log('toggle dots');
          (myGame.lvlOn) ? (myGame.lvlOn = false) : (myGame.lvlOn = true);
          break;
        case 88: // X key
          console.log('toggle px test box');
          (myGame.pxBoxOn) ? (myGame.pxBoxOn = false) : (myGame.pxBoxOn = true);
          break;
        default: // Everything else
          console.log("key = ", code);
          break;
    }
}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');
  CANVAS.addEventListener('keydown',keyDown,false);
  // CANVAS.addEventListener('keyup',keyUp,false);

  // this is to correct for canvas blurryness on single pixel wide lines etc
  // this is extremely important when animating to reduce rendering artifacts and other oddities
  ctx.translate(0.5, 0.5);

  myGame = new Game();
  myGame.init();
  State.loopRunning = true;
  State.myReq = requestAnimationFrame(gameLoop);

  setInterval(clockTimer, 1000);

  $('#start-btn').click(function() {
    console.log("start button clicked");
    myGame = new Game(10); // param = ms per update()
    State.loopRunning = true;
    myGame.init();
    State.gameStarted = true;
    CANVAS.focus();  // set focus to canvas on start so keybindings work
  });

  $("#stop").click(function() {
    cancelAnimationFrame(State.myReq);
  });

  myGame = new Game(10); // param = ms per update()
  State.loopRunning = true;
  myGame.init();
  State.gameStarted = true;
  CANVAS.focus();  // set focus to canvas on start so keybindings work


});
