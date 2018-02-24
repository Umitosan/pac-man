/*jshint esversion: 6 */

// original 1980s dimentions
// 26-28 tiles wide 26 dots fit 28 tiles with edge
// 29-31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="702" height="777"

// sample level image
// http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png

//////////////////////
// HELPER FUNCTIONS
//////////////////////

// ref https://www.w3schools.com/colors/colors_shades.asp
var Colors = {
  black:    'rgba(0, 0, 0, 1)',
  darkGrey: 'rgba(50, 50, 50, 1)',
  lightGreyTrans: 'rgba(50, 50, 50, 0.3)',
  greyReset: 'rgb(211,211,211)',
  lighterGreyReset: 'rgb(240,240,240)',
  white: 'rgba(250, 250, 250, 1)',
  red: 'rgba(230, 0, 0, 1)',
  green: 'rgba(0, 230, 0, 1)',
  blue: 'rgba(0, 0, 230, 0.7)',
  pacYellow: 'rgba(255,255,1,1)'
};

function TxtBox(x,y,txt) {
  this.x = x;
  this.y = y;
  this.font = "32px Georgia";
  this.color = myColors.blue;
  this.txt = txt;

  this.draw = function() {
    var ctx = canvas.getContext('2d');
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.fillText(this.txt,this.x,this.y);
  };
}


function clockTimer() {
  State.pageLoadTime += 1;
  $('#clock').text(State.pageLoadTime);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function getRadianAngle(degreeValue) {
  return degreeValue * Math.PI / 180;
}

function randSign() {
  let num = getRandomIntInclusive(1,2);
  if (num === 1) {
    return 1;
  } else {
    return -1;
  }
}

function randColor(type) {
  // more muted colors example
      // return ( "#" + Math.round((getRandomIntInclusive(0,99999999) + 0x77000000)).toString(16) );
  // full spectum below
  if (type === 'hex') {
    return ( "#" + Math.round((getRandomIntInclusive(0,0xffffff))).toString(16) );
  } else if (type === 'rgba') {
    return ( 'rgba('+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+ getRandomIntInclusive(0,255) +','+1+')' );
  } else {
    console.log("Not valid option for randColor()");
    return undefined;
  }
}

function invertRGBAstr(str) {
  let arr1 = str.slice(5,-1); // arr1 = "173,216,230,0.2"
  let arr2 = arr1.split(','); // arr2 = ["173","216","230","0.2"]
  let r = -1 * arr2[0] + 255;
  let g = -1 * arr2[1] + 255;
  let b = -1 * arr2[2] + 255;
  let a = arr2[3];
  return 'rgba('+r+','+g+','+b+','+a+')';
}


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
  this.updateDuration = updateDur;
  this.lastUpdateTime = 0;
  this.lastKey = 0;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,velocity,width,faceDirection,moveState)
    this.myPac = new Pac( /* x */             200,
                          /* y */             CANVAS.height/2,
                          /* velocity */      5,
                          /* width */         42,
                          /* faceDirection */ 'right',
                          /* moveState */     'go'
                        );
    // init ghosts
    this.myPac.init();
  };
  this.drawBG = function() {
    ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
  };
  this.draw = function() {
    if (this.myPac) {
      this.myPac.draw();
    }
    // this.ghosts.each( (g) => { g.update() });
  };
  this.update = function() {
    this.myPac.update();
  };
}

function Pac(x,y,velocity,diameter,direction,moveState)  {
  this.x = x;
  this.y = y;
  this.vel = velocity;
  this.diameter = diameter;
  this.radius = diameter/2;
  this.mouthSize = getRadianAngle(50);
  this.mouthVel = getRadianAngle(2); // 2 degree in radians
  this.direction = direction;
  this.rotateFace = 0;
  this.moveState = moveState;
  this.color = Colors.pacYellow;
  this.lineW = 2;

  this.init = function() {
    this.rotatePacFace();
  }; // init

  this.toggleState = function() {
    if (this.moveState === 'go') {
      this.moveState = 'stop';
    } else if (this.moveState === 'stop') {
      this.moveState = 'go';
    } else {
      // nothin
    }
    console.log('pac state = ', this.moveState);
  };

  this.inBounds = function() { // is pac in bounds? (true/false)
    var bounds;
    if ( (this.direction === 'left') && (this.x - Math.abs(this.vel) - this.radius < 0) ) {
      bounds = false;
    } else if ( (this.direction === 'right') && (this.x + this.vel + this.radius >= CANVAS.width) ) {
      bounds = false;
    } else if ( (this.direction === 'up') && (this.y - Math.abs(this.vel) - this.radius < 0) ) {
      bounds = false;
    } else if ( (this.direction === 'down') && (this.y + this.vel + this.radius >= CANVAS.height) ) {
      bounds = false;
    } else {
      bounds = true;
    }
    return bounds;
  }; // inBounds

  this.changeDir = function(dir) {
    if (this.moveState === 'go') {
      if (dir === 'left') {
        this.direction = 'left';
        this.vel = -Math.abs(this.vel);
        this.rotatePacFace();
      } else if (dir === 'right') {
        this.direction = 'right';
        this.vel = Math.abs(this.vel);
        this.rotatePacFace();
      } else if (dir === 'up') {
        this.direction = 'up';
        this.vel = -Math.abs(this.vel);
        this.rotatePacFace();
      } else if (dir === 'down') {
        this.direction = 'down';
        this.vel = Math.abs(this.vel);
        this.rotatePacFace();
      } else {
        console.log(' changeDir problems ');
      }
    }
  };

  this.toggleDir = function(dir) {
    switch (dir) {
      case 'left':  this.changeDir('right');  break;
      case 'right':  this.changeDir('left');  break;
      case 'up':  this.changeDir('down');  break;
      case 'down':  this.changeDir('up');  break;
      default:
        console.log("toggleDir broke");
        break;
    }
  };

  this.rotatePacFace = function() {
    console.log("rotatePacFace");
    switch ( this.direction )  {
      case 'left':  this.rotateFace = Math.PI;  break;
      case 'right':  this.rotateFace = 0;  break;
      case 'up':  this.rotateFace = Math.PI*3/2;  break;
      case 'down':  this.rotateFace = Math.PI/2;  break;
      case 'stop': console.log("stopped");  break;
      default:
        console.log("rotatePacFace broke");
        break;
    } // end switch
  };

  this.nextMouth = function() {
    if ( (this.mouthSize+this.mouthVel) >= getRadianAngle(50) ) {
      console.log('mouth too BIG');
      this.mouthVel = -Math.abs(this.mouthVel);
    } else if ( (this.mouthSize+this.mouthVel) <= 0 ) {
      console.log('mouth too SMALL');
      this.mouthVel = Math.abs(this.mouthVel);
    } else {
      // nothing
    }
    this.mouthSize += this.mouthVel;
  };

  // move pac in facing direction
  this.movePac = function() {
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      this.x += this.vel;
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      this.y += this.vel;
    } else {
      console.log(' slide problems ');
    }
  }; // slide

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineW;
    ctx.beginPath();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rotateFace);
    // ctx.arc(x,y,r,sAngle,eAngle,[counterclockwise]);
    // ctx.arc(0,0, this.radius, (Math.PI/4)*this.mouthSize, -(Math.PI/4)*this.mouthSize );
    ctx.arc(0,0, this.radius, this.mouthSize, -this.mouthSize );
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fill();   // fill the arc
    ctx.stroke();  // draw the line
    ctx.rotate(-this.rotateFace);
    ctx.translate(-this.x,-this.y);
  }; // draw

  this.update = function() {
    if (this.moveState === 'go') {
      if (!this.inBounds()) {  // not in bounds so change direction
        console.log("change direction");
        this.toggleDir(this.direction);
      } else {  // is in bounds, proceed as normal
        this.movePac();
        this.nextMouth();
      }
    } else if (this.moveState === 'stop') {
      // pac is stopped
    } else {
      // nothin
    }
  }; // update

} // PAC

function Ghost() {

  this.init = function() {
    // init
  };
  this.draw = function() {
    // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  };
  this.update = function() {
    // update positions
  };
}


//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  // if ( (State.loopRunning) && (State.gameStarted) ) {
  //   var now = performance.now();
  //   if ( (now - myGame.lastUpdateTime) >= myGame.updateDuration ) {
  //     var timesToUpdate = Math.ceil( (now - myGame.lastUpdateTime) / myGame.updateDuration);
  //     for (var i=0; i < timesToUpdate; i++) {
  //       myGame.update();
  //     }
  //     myGame.lastUpdateTime = performance.now();
  //   }
  // }
  //
  // if ( (State.loopRunning) && (State.gameStarted) ) {
  //   if (State.frameCounter >= myGame.updateDuration) {
  //     State.frameCounter = 0;
  //     myGame.update();
  //   } else {
  //     State.frameCounter += 1;
  //   }
  // }

  if ( (State.loopRunning) && (State.gameStarted) && (myGame.myPac.moveState === 'go') ) {
    myGame.update();
  }

  clearCanvas();

  // ctx.beginPath();
  // ctx.strokeStyle = Colors.white;
  // ctx.lineWidth = 1;
  // ctx.moveTo(CANVAS.width-5,0);
  // ctx.lineTo(CANVAS.width-5,CANVAS.height);
  // ctx.stroke();


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
    event.preventDefault(); // prevents window from moving around
    myGame.lastKey = event.keyCode;
    let code = event.keyCode;
    switch (code) {
        case 37: // Left key
          console.log("key Left = ", code);
          myGame.myPac.changeDir('left');
          break;
        case 39: //Right key
          console.log("key Right = ", code);
          myGame.myPac.changeDir('right');
          break;
        case 38: // Up key
          console.log("key Up = ", code);
          myGame.myPac.changeDir('up');
          break;
        case 40: //Down key
        console.log("key Down = ", code);
          myGame.myPac.changeDir('down');
          break;
        case 32: // spacebar
          myGame.myPac.toggleState();
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
    myGame = new Game(0.5);
    State.loopRunning = true;
    myGame.init();
    State.gameStarted = true;
    CANVAS.focus();  // set focus to canvas on start so keybindings work
  });

  $("#stop").click(function() {
    cancelAnimationFrame(State.myReq);
  });

});
