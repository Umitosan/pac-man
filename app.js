/*jshint esversion: 6 */

// original 1980s dimentions
// width: 38 tiles wide - 26 dots + 2 tiles of edge
// height: 31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="676" height="751"

// sample level image
// http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png

// more info here http://pacman.wikia.com/wiki/Pac-Man_(game)

// more info http://pacmanmuseum.com/history/pacman-scoring.php
// SCORING
// Pac-Dot - 10 points.
// Power Pellet - 50 points.
// Vulnerable Ghosts: #1 in succession - 200 points. #2 in succession - 400 points. #3 in succession - 800 points. #4 in succession - 1600 points.
// Fruit: Cherry: 100 points. Strawberry: 300 points. Orange: 500 points. Apple: 700 points. Melon: 1000 points

///////////////////
// STATE
///////////////////

var State = {
  canvas: undefined,
  ctx: undefined,
  myGame: undefined,
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
  lastDirKey: 'none',
  bg: new Image()
};

function hardReset() {
  State = {
    canvas: undefined,
    ctx: undefined,
    myGame: undefined,
    loopRunning: false,
    gameStarted: false,
    myReq: undefined, // holds the ID # of the current requestAnimationFrame
    playTime: 0,
    playStart: undefined,
    lastFrameTimeMs: 0, // The last time the loop was run
    maxFPS: 60, // The maximum FPS allowed
    pageLoadTime: 0,
    frameCounter: 0,
    gridSpacing: 25, // dimentions of grid in pixels
    gridWidth: 28,
    gridHeight: 31,
    lastDirKey: 'none',
    bg: new Image()
  };
  State.bg.src = 'img/reference2.png';
}

//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  if ( (State.loopRunning === true) && (State.gameStarted === true) ) { myGame.update();  }

  clearCanvas();
  if (State.gameStarted === false) {
      State.ctx.imageSmoothingEnabled = false;   // turns off AntiAliasing
    // myGame.drawBG();
    State.ctx.drawImage(State.bg,4,4,State.canvas.width-9,State.canvas.height-9);
    State.ctx.beginPath();
    State.ctx.strokeStyle = Colors.blue;
    State.ctx.lineWidth = 4;
    State.ctx.rect(2, 2, State.canvas.width-4, State.canvas.height-4);
    State.ctx.stroke();
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
          if (myGame.paused === true) {
            myGame.unpauseIt();
          } else if (myGame.paused === false) {
            myGame.pauseIt();
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
          // myGame.toggleLvl(); // old option to change level draw type
          break;
        case 88: // X key
          console.log('toggle px test box');
          myGame.pxBoxOn = (myGame.pxBoxOn) ? false : true;
          break;
        case 67: // C key
          console.log('c button');
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

  State.canvas =  $('#canvas')[0];
  State.ctx =  State.canvas.getContext('2d');
  State.canvas.addEventListener('keydown',keyDown,false);
  // document.getElementById("game-container").addEventListener('keydown',keyDown,false);
  // document.addEventListener('keyup',keyUp,false);

  // this is to correct for canvas blurryness on single pixel wide lines etc
  // this is extremely important when animating to reduce rendering artifacts and other oddities
  State.ctx.translate(0.5, 0.5);

  // start things up so that the background image can be drawn, but don't init myGame
  State.bg.src = 'img/reference2.png';
  State.loopRunning = true;
  State.myReq = requestAnimationFrame(gameLoop);

  $('#start-btn').click(function() {
    console.log("start button clicked");
    if (State.myReq !== undefined) {  // reset game loop if already started
      console.log('tried to cancel');
      cancelAnimationFrame(State.myReq);
      hardReset();
    }
    State.canvas =  $('#canvas')[0];
    State.ctx =  State.canvas.getContext('2d');
    clearCanvas();
    $('#score').text('0000');
    myGame = new Game(10); // param = ms per update()
    myGame.init();
    State.canvas.focus();  // set focus to canvas on start so keybindings work, if needed
    console.log("document.activeElement = ", document.activeElement);
    State.myReq = requestAnimationFrame(gameLoop);
    State.playStart = performance.now();
    State.loopRunning = true;
    State.gameStarted = true;
  });

});
