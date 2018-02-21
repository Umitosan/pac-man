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

function Game(updateDur = 100) {
  this.paused = true;
  this.bg = new Image();
  this.started = false;
  this.myPac = undefined;
  this.ghosts = undefined;
  this.updateDuration = updateDur;
  this.lastUpdateTime = 0;

  this.init = function() {
    this.bg.src = 'img/reference1.png';
    // Pac(x,y,xVelocity,yVelocity,width,faceDirection,moveState)
    this.myPac = new Pac( /* x */             200,
                          /* y */             CANVAS.height/2,
                          /* xVelocity */     2,
                          /* yVelocity */     0,
                          /* width */         42,
                          /* faceDirection */ 'right',
                          /* moveState */     'go'
                        );
    // init ghosts
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

function Pac(x,y,xVelocity,yVelocity,diameter,direction,moveState)  {
  this.x = x;
  this.y = y;
  this.xVel = xVelocity;
  this.yVel = yVelocity;
  this.diameter = diameter;
  this.radius = diameter/2;
  this.mouthSize = 0.523599; // 30 degrees in radians
  this.mouthVel = 0.0174533; // 1 degree in radians
  this.baseMouthVel = 0.0174533; // 1 degree in radians
  this.direction = direction;
  this.moveState = moveState;
  this.color = Colors.pacYellow;
  this.lineW = 2;

  this.init = function() {
    // init
  }; // init

  // move pac in facing direction
  this.slide = function() {
    if (this.direction === 'left') {
      this.x += this.xVel;
    } else if (this.direction === 'right') {
      this.x += this.xVel;
    } else if (this.direction === 'up') {
      this.y += this.yVel;
    } else if (this.direction === 'down') {
      this.y += this.yVel;
    } else {
      console.log(' slide problems ');
    }
  }; // slide

  this.inBounds = function() { // is pac in bounds? (true/false)
    var bounds;
    if ( (this.direction === 'left') && (this.x - this.radius < 6) ) {
      bounds = false;
    } else if ( (this.direction === 'right') && (this.x + this.radius > CANVAS.width-6) ) {
      bounds = false;
    } else if ( (this.direction === 'down') && (this.y + this.radius > CANVAS.height-6) ) {
      bounds = false;
    } else if ( (this.direction === 'up') && (this.y - this.radius < 6) ) {
      bounds = false;
    } else {
      bounds = true;
    }
    return bounds;
  }; // inBounds

  this.changeDir = function() {
    if (this.direction === 'right') {
      this.xVel *= -1;
      this.direction = 'left';
    } else if (this.direction === 'left') {
      this.xVel *= -1;
      this.direction = 'right';
    } else if (this.direction === 'up') {
      this.yVel *= -1;
      this.direction = 'down';
    } else if (this.direction === 'down') {
      this.yVel *= -1;
      this.direction = 'up';
    } else {
      console.log(' slide problems ');
    }
    console.log('this.xVel = ', this.xVel);
  };

  this.nextMouth = function() {
    if ( this.mouthSize >= Math.PI/3 ) {
      this.mouthVel = -this.baseMouthVel;
    } else if ( this.mouthSize <= 0 ) {
      this.mouthVel = this.baseMouthVel;
    } else {
      // do nothing?
    }
    this.mouthSize += this.mouthVel;
  };

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.

    // ctx.fillStyle = this.color;
    // ctx.beginPath();
    // ctx.moveTo(this.x,this.y);
    // ctx.arc(this.x,this.y,this.radius,(2*Math.PI)+Math.PI/6,(2*Math.PI)-Math.PI/6);
    // ctx.lineTo(this.x,this.y);
    // ctx.closePath();
    // ctx.fill();

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineW;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y); // new center of drawing map is center of pacman

    // ctx.arc(x,y,r,sAngle,eAngle,[counterclockwise]);
    switch ( this.direction )  {
      case 'left':
        ctx.arc(this.x, this.y, this.radius, ( (Math.PI*2/3)*this.mouthSize)-Math.PI, ( -(Math.PI*2/3)*this.mouthSize));  break;
      case 'right':
        ctx.arc(this.x, this.y, this.radius, (Math.PI/6)*this.mouthSize, -(Math.PI/6)*this.mouthSize   );  break;
      case 'up':
        ctx.arc(this.x, this.y, this.radius, (-(2*Math.PI)/3)*this.mouthSize, ((2*Math.PI)/3)*this.mouthSize);  break;
      case 'down':
        ctx.arc(this.x, this.y, this.radius, (-(2*Math.PI)/3)*this.mouthSize, ((2*Math.PI)/3)*this.mouthSize);  break;
      case 'stop':
        ctx.arc(this.x, this.y, this.radius, (-(2*Math.PI)/3)*this.mouthSize, ((2*Math.PI)/3)*this.mouthSize);  break;
      default: console.log("switch broke"); break;
    } // end switch

    ctx.lineTo(this.x,this.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();

  }; // draw

  this.update = function() {
    if (this.moveState === 'go') {
      if (!this.inBounds()) {  // not in bounds so change direction
        console.log("time to change direction!");
        this.changeDir();
        this.slide();
        this.nextMouth();
      } else {  // is in bounds, proceed as normal
        this.slide();
        this.nextMouth();
      }
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

  if ( (State.loopRunning) && (myGame.started) ) {
    var now = performance.now();
    if ( (now - myGame.lastUpdateTime) >= myGame.updateDuration ) {
      var timesToUpdate = Math.ceil( (now - myGame.lastUpdateTime) / myGame.updateDuration);
      for (var i=0; i < timesToUpdate; i++) {
        myGame.update();
      }
      myGame.lastUpdateTime = performance.now();
    }
  }

  clearCanvas();
  if (!myGame.started) {
    myGame.drawBG();
  } else {
    myGame.draw();
  }

}

//////////////////////////////////////////////////////////////////////////////////
// FRONT
//////////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  CANVAS =  $('#canvas')[0];
  ctx =  CANVAS.getContext('2d');

  myGame = new Game();
  myGame.init();
  State.loopRunning = true;
  State.myReq = requestAnimationFrame(gameLoop);

  setInterval(clockTimer, 1000);

  $('#start-btn').click(function() {
    console.log("first game loop started");
    myGame = new Game(16);
    State.loopRunning = true;
    myGame.init();
    myGame.started = true;
    State.myReq = requestAnimationFrame(gameLoop);
  });

  $("#stop").click(function() {
    cancelAnimationFrame(State.myReq);
  });

});
