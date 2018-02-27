/*jshint esversion: 6 */

// original 1980s dimentions
// 26-28 tiles wide 26 dots fit 28 tiles with edge
// 29-31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="702" height="777"

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
};

function Game(updateDur) {
  this.paused = true;
  this.bg = new Image();
  this.myPac = undefined;
  this.ghosts = undefined;
  this.updateDuration = updateDur;  // milliseconds duration between update()
  this.lastUpdate = 0;
  this.timeGap = 0;
  this.lastKey = 0;
  this.gridOn = false;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,velocity,width,faceDirection,moveState)
    this.myPac = new Pac( /* x */             200,
                          /* y */             CANVAS.height/2,
                          /* velocity */      2,
                          /* width */         42,
                          /* faceDirection */ 'right',
                          /* moveState */     'stop'
                        );
    // init ghosts
    this.myPac.init();
  };
  this.drawBG = function() {
    ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
  };
  this.draw = function() {
    if (myGame.gridOn) myGame.drawGrid();
    if (this.myPac) this.myPac.draw();
  };
  this.drawGrid = function() {
    let spacing = 30;
    let vertTotal = Math.floor(CANVAS.width / spacing)+1;
    let horizTotal = Math.floor(CANVAS.height / spacing)+1;
    // console.log("vert horiz : "+vertTotal+"  "+horizTotal);
    for (let i = 0; i < vertTotal; i++) {
      // function drawLine(x1,y1,x2,y2,width,color)
      drawLine(i*spacing,0,i*spacing,CANVAS.height,1,'green');
    }
    for (let i = 0; i < horizTotal; i++) {
      drawLine(0,i*spacing,CANVAS.width,i*spacing,1,'green');
    }
  };
  this.update = function() {
    // performance based update: myGame.update() runs every myGame.updateDuration milliseconds
    this.timeGap = performance.now() - this.lastUpdate;
    if ( this.timeGap >= this.updateDuration ) {
      let timesToUpdate = this.timeGap / this.updateDuration;
      if (this.myPac.moveState === 'go') {
        for (let i=0; i < timesToUpdate; i++) {
          this.myPac.update();
        }
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

// simpler fps-based update based on overall fps limiter
// if ( (State.loopRunning) && (State.gameStarted) && (myGame.myPac.moveState === 'go') ) {
//   if (State.frameCounter >= myGame.updateDuration) {
//     State.frameCounter = 0;
//     myGame.update();
//   } else {
//     State.frameCounter += 1;
//   }
// }

// simplest update() every frame aprox 60/sec
// if ( (State.loopRunning) && (State.gameStarted) && (myGame.myPac.moveState === 'go') ) {
//   myGame.update();
// }



//////////////////////////////////////////////////////////////////////////////////
// KEYBINDINGS
//////////////////////////////////////////////////////////////////////////////////
function keyDown(event) {
    event.preventDefault(); // prevents window from moving around
    myGame.lastKey = event.keyCode;
    let code = event.keyCode;
    switch (code) {
        case 37: // Left key
          console.log("key Left = ", code);
          myGame.myPac.changeDir('left');
          myGame.myPac.moveState = 'go';
          break;
        case 39: //Right key
          console.log("key Right = ", code);
          myGame.myPac.changeDir('right');
          myGame.myPac.moveState = 'go';
          break;
        case 38: // Up key
          console.log("key Up = ", code);
          myGame.myPac.changeDir('up');
          myGame.myPac.moveState = 'go';
          break;
        case 40: //Down key
        console.log("key Down = ", code);
          myGame.myPac.changeDir('down');
          myGame.myPac.moveState = 'go';
          break;
        case 32: // spacebar
          myGame.myPac.toggleState();
          break;
        case 71: // G key
          console.log('toggle grid');
          (myGame.gridOn) ? (myGame.gridOn = false) : (myGame.gridOn = true);
          break;
        default: // Everything else
          console.log("key = ", code);
          break;
    }
}
// function keyUp(event) {
//     let code = event.keyCode;
//     switch (code) {
//         case 37: console.log("(key up) Left = ", code); break; //Left key
//         case 38: console.log("(key up) Up = ", code); break; //Up key
//         case 39: console.log("(key up) Right = ", code); break; //Right key
//         case 40: console.log("(key up) Down = ", code); break; //Down key
//         default: console.log('(key up) = ', code); //Everything else
//     }
// }


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

});
