//////////////////////
// HELPER FUNCTIONS
//////////////////////

/*jshint esversion: 6 */

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
  pacYellow: 'rgba(255,255,1,1)',
  aqua: 'rgba(127,255,212,1)',
  dotPink: 'rgba(247, 200, 183,1)',
  ghostPink: 'rgba(255,192,203,1)'
};

function clearCanvas() {
  State.ctx.clearRect(-1, -1, State.canvas.width+1, State.canvas.height+1); // offset by 1 px because the whole canvas is offset initially (for better pixel accuracy)
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

function drawLine(x1,y1,x2,y2,width,color) {
  let ctx = State.ctx;
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.restore();
}

function roundRect(x, y, w, h, r) {
  let ctx = State.ctx;
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
  ctx.stroke();
}

function atGridIntersection(x,y,vel) {
  var atInter = false;
  var offset = Math.abs(vel);
  var xDis = ( (x) % State.gridSpacing );
  var yDis = ( (y) % State.gridSpacing );
  if ( (xDis <= offset) && (yDis <= offset) ) {
    atInter = true;
  }
  return atInter;
}

function getNearestIntersection(someX, someY) {
  let spacing = State.gridSpacing;

  let foundRow = 'none';
  let foundCol = 'none';
  let foundChar = 'none';

  foundRow = Math.round(someY/spacing)-1; // -1 to offset the fact that arrays count starting at 0
  foundCol = Math.round(someX/spacing)-1;

  foundChar = myGame.myLevel.currentLevel[ foundRow ][ foundCol ];

  return { char: foundChar,
            row: foundRow,
            col: foundCol };
}
