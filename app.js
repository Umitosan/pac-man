/*jshint esversion: 6 */

// original 1980s dimentions
// width: 38 tiles wide - 26 dots + 2 tiles of edge
// height: 31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="676" height="751"

// sample level image
// http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png

// more info here http://pacman.wikia.com/wiki/Pac-Man_(game)

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

function hardReset() {
  myGame = undefined;
  State = {
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
  clearCanvas();
}

// SCORING
// Pac-Dot - 10 points.
// Power Pellet - 50 points.
// Vulnerable Ghosts: #1 in succession - 200 points. #2 in succession - 400 points. #3 in succession - 800 points. #4 in succession - 1600 points.
// Fruit: Cherry: 100 points. Strawberry: 300 points. Orange: 500 points. Apple: 700 points. Melon: 1000 points

function Game(updateDur) {
  this.paused = false;
  this.bg = new Image();
  this.myPac = undefined;
  this.myLevel = undefined;
  this.ghosts = [];
  this.score = 0;
  this.updateDuration = updateDur;  // milliseconds duration between update()
  this.lastUpdate = 0;
  this.timeGap = 0;
  this.lastKey = 0;
  this.gridOn = false;
  this.lvlOnType = 1;
  this.pxBoxOn = false;

  this.bigPillEffect = false;
  this.bigPillEffectDur = null;
  this.bigPillEffectStart = null;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,velocity,width,direction,moveState)
    this.myPac = new Pac( /* x */             (14*State.gridSpacing)+(State.gridSpacing/2),
                          /* y */             24*State.gridSpacing,
                          /* velocity */      3,
                          /* width */         (State.gridSpacing*2)-10,
                          /* direction */     'right',
                          /* moveState */     'stop'
                        );
    // init ghosts
    this.myPac.init();
    this.myLevel = new Level();
    this.myLevel.init();
    this.ghosts.push(new Ghost( /*   x  */  State.gridSpacing*14+State.gridSpacing/2,
                                /*   y  */  State.gridSpacing*12,
                                /* name */  "blinky",
                                /*frame0*/ 2
                              ));
    for (let g=0;g < this.ghosts.length; g++ ) {
      this.ghosts[g].init('img/blinky.png');
      let src = this.ghosts[g].spriteSheet.src;
    }
  };

  this.resetUpdateGap = function() {
    this.timeGap = 0;
    this.lastUpdate = 0;
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

  this.updateScore = function(lvlChar) {
    if (lvlChar === 0) {
      this.score += 10;
      $('#score').text(myGame.score);
    } else if (lvlChar === 'B') {
      this.score += 50;
      $('#score').text(myGame.score);
    } else {
      console.log('updateScore problems, char is = ', lvlChar);
    }
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
    if (this.ghosts.length > 0) {
      for (let g=0;g < this.ghosts.length; g++ ) {
        this.ghosts[g].draw();
      }
    }
    if (this.myPac) this.myPac.draw();
  };

  this.update = function() {
    // performance based update: myGame.update() runs every myGame.updateDuration milliseconds
    this.timeGap = performance.now() - this.lastUpdate;

    if ( (this.paused === true) || (State.playTime < 1) ) { // this prevents pac from updating many times after UNpausing
      this.lastUpdate = performance.now();
      this.timeGap = 0;
    }

    if ( this.timeGap >= this.updateDuration ) {
      let timesToUpdate = this.timeGap / this.updateDuration;
      // if (timesToUpdate > 2) { console.log('timesToUpdate = ', timesToUpdate); }
      for (let i=1; i < timesToUpdate; i++) {
        this.myPac.update();
        for (let g=0;g < this.ghosts.length; g++ ) {
          this.ghosts[g].update();
        }
      }
      this.lastUpdate = performance.now();
    }

    this.updatePlayTime();
  }; // game update
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

  $('#start-btn').click(function() {
    console.log("start button clicked");
    if (State.myReq !== undefined) {  // reset game loop if already started
      console.log('tried to cancel');
      cancelAnimationFrame(State.myReq);
      hardReset();
    }
    $('#score').text('0000');
    myGame = new Game(10); // param = ms per update()
    myGame.init();
    CANVAS.focus();  // set focus to canvas on start so keybindings work
    State.myReq = requestAnimationFrame(gameLoop);
    State.playStart = performance.now();
    State.loopRunning = true;
    State.gameStarted = true;
  });

});
