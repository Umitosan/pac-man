/*jshint esversion: 6 */

// original 1980s dimentions
// 26-28 tiles wide 26 dots fit 28 tiles with edge
// 29-31 tiles tall 29 dots fit 31 tiles with edge
// canvas width="702" height="777"

// sample level image
// http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png

///////////////////
// HELPER FUNCTIONS / OBJECTS
///////////////////

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

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function clearCanvas() {
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function clockTimer() {
  State.time += 1;
  $('#clock').text(State.time);
}


///////////////////
// GAME
///////////////////

var CANVAS = $('#canvas')[0];

var State = {
  time: 0,
  myReq: undefined,
  lastFrameTimeMs: 0, // The last time the loop was run
  maxFPS: 60, // The maximum FPS we want to allow
  loopRunning: false,
  pageLoadTime: 0
};

function Game() {

  this.init = function() {

  };
  this.draw = function() {

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

  // if (loopRunning) {
  //   var now = performance.now();
  //   if ( (now - bubbleStack.lastUpdateTime) >= bubbleStack.sortDuration ) {
  //     var timesToUpdate = Math.ceil( (now - bubbleStack.lastUpdateTime) / bubbleStack.sortDuration);
  //     for (var i=0; i < timesToUpdate; i++) {
  //       bubbleStack.update();
  //       if (bubbleStack.sorted) { break; }
  //     }
  //     bubbleStack.lastUpdateTime = performance.now();
  //   }
  // }
  // clearCanvas();
  // bubbleStack.draw();
}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  State.pageLoadTime = performance.now();

  setInterval(clockTimer, 1000);

  $('#start').click(function() {
    if (State.myReq !== undefined) {
      cancelAnimationFrame(State.myReq);
    } else {
      console.log("first game loop started");
    }
    clearCanvas();
    State.loopRunning = false;
    // init()
    // draw()
  });

});
