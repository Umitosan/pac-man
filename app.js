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
  myReq: undefined,
  playTime: 0,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS we want to allow
  pageLoadTime: 0,
};

function Game() {
  this.paused = true;
  this.bg = new Image();

  this.init = function() {
    this.bg.src = 'img/reference1.png';
  };
  this.draw = function() {
    ctx.imageSmoothingEnabled = false;  // turns off AntiAliasing
    // simple draw image:     drawImage(image, x, y)
    // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    ctx.drawImage(this.bg,0,0,CANVAS.width,CANVAS.height);
  };
  this.update = function() {

  };
}

function Pac() {

  this.init = function() {

  };
  this.draw = function() {

  };
  this.update = function() {

  };
}


//////////////////////////////////////////////////////////////////////////////////
// GAME LOOP
//////////////////////////////////////////////////////////////////////////////////
function gameLoop(timestamp) {
  // timestamp is automatically returnd from requestAnimationFrame
  // timestamp uses performance.now() to compute the time
  State.myReq = requestAnimationFrame(gameLoop);

  // if (State.loopRunning) {
  //   var now = performance.now();
  //   if ( (now - myGame.lastUpdateTime) >= myGame.sortDuration ) {
  //     var timesToUpdate = Math.ceil( (now - myGame.lastUpdateTime) / myGame.sortDuration);
  //     for (var i=0; i < timesToUpdate; i++) {
  //       myGame.update();
  //       if (myGame.sorted) { break; }
  //     }
  //     myGame.lastUpdateTime = performance.now();
  //   }
  // }
  clearCanvas();
  myGame.draw();
}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');

  console.log('CANVAS = ', CANVAS);
  console.log('ctx = ', ctx);

  setInterval(clockTimer, 1000);

  $('#start-btn').click(function() {
    console.log('start button clicked');
    if (State.myReq !== undefined) {
      cancelAnimationFrame(State.myReq);
      clearCanvas();
    } else {
      console.log("first game loop started");
      myGame = new Game();
      clearCanvas();
      State.loopRunning = true;
      myGame.init();
      // myGame.draw();
      State.myReq = requestAnimationFrame(gameLoop);
    }
  });

});
