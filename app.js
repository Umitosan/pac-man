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
  playStart: undefined,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS allowed
  pageLoadTime: 0,
  frameCounter: 0,
  gridSpacing: 25, // dimentions of grid in pixels
  gridWidth: 28,
  gridHeight: 31,
  lastDirKey: 'none'
};

// scoring
// 200 PTS for eating a ghost
// 10 for small DOT
// 50 for large DOT


function Game(updateDur) {
  this.paused = false;
  this.bg = new Image();
  this.myPac = undefined;
  this.myLevel = undefined;
  this.ghosts = undefined;
  this.updateDuration = updateDur;  // milliseconds duration between update()
  this.lastUpdate = 0;
  this.timeGap = 0;
  this.lastKey = 0;
  this.gridOn = false;
  this.lvlOnType = 1;
  this.pxBoxOn = false;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,velocity,width,direction,moveState)
    this.myPac = new Pac( /* x */             (14*State.gridSpacing)+(State.gridSpacing/2),
                          /* y */             24*State.gridSpacing,
                          /* velocity */      3,
                          /* width */         (State.gridSpacing*2+2)-12,
                          /* direction */     'right',
                          /* moveState */     'stop'
                        );
    // init ghosts
    this.myPac.init();
    this.myLevel = new Level();
    this.myLevel.init();
  };

  this.toggleLvl = function() {
    if (this.lvlOnType === 2) {
      this.lvlOnType = 0;
    } else {
      this.lvlOnType += 1;
    }
  };

  this.updatePlayTime = function() {
    State.playTime = performance.now() - State.playStart;
    let roundedPlayTime = Math.floor(State.playTime / 1000);
    $('#clock').text(roundedPlayTime);
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
    ctx.drawImage(this.bg,4,4,CANVAS.width-9,CANVAS.height-9);
  };

  this.draw = function() {
    if (myGame.gridOn) myGame.drawGrid();
    if (this.lvlOnType !== 0) this.myLevel.draw();
    if (this.myPac) this.myPac.draw();
  };

  this.update = function() {
    // performance based update: myGame.update() runs every myGame.updateDuration milliseconds
    this.timeGap = performance.now() - this.lastUpdate;

    if (this.paused === true) { // this prevents pac from updating many times after UNpausing
      this.lastUpdate = performance.now();
      this.timeGap = 0;
    }

    if ( this.timeGap >= this.updateDuration ) {
      let timesToUpdate = this.timeGap / this.updateDuration;
      // console.log('timesToUpdate = ', timesToUpdate);
      for (let i=1; i < timesToUpdate; i++) {
        this.myPac.update();
      }
      this.lastUpdate = performance.now();
    }

    this.updatePlayTime();
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
    ctx.beginPath();
    ctx.strokeStyle = Colors.blue;
    ctx.lineWidth = 4;
    ctx.rect(2, 2, CANVAS.width-4, CANVAS.height-4);
    ctx.stroke();
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
          if (myGame.paused === false) {
            if ( (myGame.myPac.moveState === 'stop') || ((myGame.myPac.direction !== 'left') && (State.lastDirKey !== 'left')) ) {
              State.lastDirKey = 'left';
            }
          }
          break;
        case 39: //Right key
          if (myGame.paused === false) {
            if ( (myGame.myPac.moveState === 'stop') || ((myGame.myPac.direction !== 'right') && (State.lastDirKey !== 'right')) ) {
              State.lastDirKey = 'right';
            }
          }
          break;
        case 38: // Up key
          if (myGame.paused === false) {
            if ( (myGame.myPac.moveState === 'stop') || ((myGame.myPac.direction !== 'up') && (State.lastDirKey !== 'up')) ) {
              State.lastDirKey = 'up';
            }
          }
          break;
        case 40: //Down key
          if (myGame.paused === false) {
            if ( (myGame.myPac.moveState === 'stop') || ((myGame.myPac.direction !== 'down') && (State.lastDirKey !== 'down')) ) {
              State.lastDirKey = 'down';
            }
          }
          break;
        case 32: // spacebar
          myGame.myPac.togglePacGo();
          if (myGame.paused === true) {
            myGame.paused = false;
          } else if (myGame.paused === false) {
            myGame.paused = true;
          } else {
            //nothin
          }
          console.log('myGame.paused NOW = ', myGame.paused);
          break;
        case 71: // G key
          console.log('toggle grid');
          myGame.gridOn = (myGame.gridOn) ? false : true;
          break;
        case 68: // D key
          console.log('toggle level');
          myGame.toggleLvl();
          break;
        case 88: // X key
          console.log('toggle px test box');
          myGame.pxBoxOn = (myGame.pxBoxOn) ? false : true;
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

  State.pageLoadTime = performance.now();

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');
  CANVAS.addEventListener('keydown',keyDown,false);
  // CANVAS.addEventListener('keyup',keyUp,false);

  // this is to correct for canvas blurryness on single pixel wide lines etc
  // this is extremely important when animating to reduce rendering artifacts and other oddities
  ctx.translate(0.5, 0.5);

  // start things up so that the background image can be drawn
  myGame = new Game(10);
  myGame.init();
  State.loopRunning = true;
  State.myReq = requestAnimationFrame(gameLoop);

  // setInterval(clockTimer, 1000);

  $('#start-btn').click(function() {
    console.log("start button clicked");
    if (State.myReq !== undefined) {  // reset game loop if already started
      cancelAnimationFrame(State.myReq);
      State.myReq = null;
    }
    myGame = new Game(10); // param = ms per update()
    State.loopRunning = true;
    myGame.init();
    console.log('myGame.myLevel.currentLevel = ', myGame.myLevel.currentLevel);
    State.gameStarted = true;
    CANVAS.focus();  // set focus to canvas on start so keybindings work
    State.myReq = requestAnimationFrame(gameLoop);
    State.playStart = performance.now();
  });

  // $("#stop").click(function() {
  //   cancelAnimationFrame(State.myReq);
  // });

});
