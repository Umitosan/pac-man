/*jshint esversion: 6 */

function Level(drawMode) {
  this.currentLevel = undefined;
  this.bigDotOffDur = 300;   // milliseconds
  this.bigDotBlinkTimer = 600;  // milliseconds
  this.lvlImage1 = undefined;
  this.lvlImage2 = undefined;
  this.lvlImageSelect = 1;
  this.drawMode = drawMode;

  // end of level animation
  this.lvlBlinkOn = false;
  this.lvlBlinkDur = 300; // milliseconds to show each color of lvl

  this.allLevels = {
    lvl1: [
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'], // 0
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#','B','#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#','B','#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'], // 5
      ['#', 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#','#','#','#','#','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','#','#','#','#','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','-','-','-','-','#'], // 10
      ['#','-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','W','W','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','-','-','-','-','#','#','-','#','#', 0 ,'#','#','#','#','#','#'],
      ['T','-','-','-','-','-', 0 ,'-','-','-','#','#','-','-','-','-','#','#','-','-','-', 0 ,'-','-','-','-','-','T'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','#','#','#','#','#'], // 15
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','#','#','#','#','#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'], // 20
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#','B', 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'S','S', 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 ,'B','#'],
      ['#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#'],
      ['#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#'], // 25
      ['#', 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'] // 30
    ],
    lvl2: [
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'], // 0
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#','B','#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#','B','#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'], // 5
      ['#', 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#','#','#','#','#','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','#','#','#','#','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','-','-','-','-','#'], // 10
      ['#','-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','W','W','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','-','-','-','-','#','#','-','#','#', 0 ,'#','#','#','#','#','#'],
      ['T','-','-','-','-','-', 0 ,'-','-','-','#','#','-','-','-','-','#','#','-','-','-', 0 ,'-','-','-','-','-','T'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','#','#','#','#','#'], // 15
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-','#'],
      ['#','#','#','#','#','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','#','#','#','#','#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'], // 20
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ,'#'],
      ['#','B', 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 ,'-', 0 ,'S','S', 0 ,'-', 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 ,'B','#'],
      ['#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#'],
      ['#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#'], // 25
      ['#', 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#'],
      ['#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#'],
      ['#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'] // 30
    ],
    test1: [
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'], // 0
      ['#','-','-','-','-','-','-','-','-','-','-','-','-','#','#','-','-','-','-','-','-','-','-','-','-','-','-','#'],
      ['#','-','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','-','#'],
      ['#','-','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','-','#'],
      ['#','-','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','-','#'],
      ['#','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','#'], // 5
      ['#','-','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','-','#'],
      ['#','-','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','-','#'],
      ['#','-','-','-','-','-','-','#','#','-','-','-','-','#','#','-','-','-','-','#','#','-','-','-','-','-','-','#'],
      ['#','#','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','#','#'],
      ['#','-','-','-','-','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','-','-','-','-','#'], // 10
      ['#','-','-','-','-','#','-','#','#','-','-','-','-','-','-','-','-','-','-','#','#','-','#','-','-','-','-','#'],
      ['#','-','-','-','-','#','-','#','#','-','#','#','#','W','W','#','#','#','-','#','#','-','#','-','-','-','-','#'],
      ['#','#','#','#','#','#','-','#','#','-','#','#','-','-','-','-','#','#','-','#','#','-','#','#','#','#','#','#'],
      ['T','-','-','-','-','-','-','-','-','-','#','#','-','-','-','-','#','#','-','-','-','-','-','-','-','-','-','T'],
      ['#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#'], // 15
      ['#','-','-','-','-','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','-','-','-','-','#'],
      ['#','-','-','-','-','#','-','#','#','-','-','-','-','-','-','-','-','-','-','#','#','-','#','-','-','-','-','#'],
      ['#','-','-','-','-','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','-','-','-','-','#'],
      ['#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#'],
      ['#','-','-','-','-','-','-','-','-','-','-','-','-','#','#','-','-','-','-','-','-','-','-','-','-','-','-','#'], // 20
      ['#','-','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','-','#'],
      ['#','-','#','#','#','#','-','#','#','#','#','#','-','#','#','-','#','#','#','#','#','-','#','#','#','#','-','#'],
      ['#','-','-','-','#','#','-','-','-','-','-','-','-','S','S','-','-','-','-', 0 ,'-','-','#','#','-','-','-','#'],
      ['#','#','#','-','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','-','#','#','#'],
      ['#','#','#','-','#','#','-','#','#','-','#','#','#','#','#','#','#','#','-','#','#','-','#','#','-','#','#','#'], // 25
      ['#','-','-','-','-','-','-','#','#','-','-','-','-','#','#','-','-','-','-','#','#','-','-','-','-','-','-','#'],
      ['#','-','#','#','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','#','#','-','#'],
      ['#','-','#','#','#','#','#','#','#','#','#','#','-','#','#','-','#','#','#','#','#','#','#','#','#','#','-','#'],
      ['#','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','-','#'],
      ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'] // 30
    ]
  };

  this.loadLvl = function(lvlStr) {
    let canvas = State.canvas;
    this.currentLevel = undefined;
    // Javascript loves passing references, need map and slice to shallow copy 2d array sheesh
    let testArr = this.allLevels[lvlStr].map(function(i) {
      return i.slice();
    });
    this.currentLevel = testArr;
    this.drawWalls1(Colors.blue);
    // context.getImageData(x,y,width,height);
    this.lvlImage1 = undefined;
    this.lvlImage1 = State.ctx.getImageData(0,0,canvas.width,canvas.height);
    this.drawWalls1(Colors.white);
    this.lvlImage2 = undefined;
    this.lvlImage2 = State.ctx.getImageData(0,0,canvas.width,canvas.height);
  };

  this.timeToBlink = function() {
    let blinkIt = false;
    if ((State.playTime % this.bigDotBlinkTimer) < this.bigDotOffDur) {
      blinkIt = true;
    }
    return blinkIt;
  };

  this.countDots = function() {
    let count = 0;
    for (let r = 0; r < this.currentLevel.length; r++) {
      let row = this.currentLevel[r];
      for (let c = 0; c < row.length; c++) {
        if ( (this.currentLevel[r][c] === 0) || (this.currentLevel[r][c] === 'B') ) {
          count++;
        }
      }
    }
    return count;
  };

  this.drawDots = function() {
    let ctx = State.ctx;
    let spacing = State.gridSpacing;
    for (let r = 0; r < this.currentLevel.length; r++) {
      for (let c = 0; c < this.currentLevel[r].length; c++) {
        if (this.currentLevel[r][c] === 0) { // it's a dot! so print it!
          ctx.beginPath();
          ctx.fillStyle = Colors.dotPink;
          ctx.arc( (spacing + c * spacing) , (spacing + r * spacing) , 3 , 0 , Math.PI*2 ); // ctx.arc(x,y,radius,sAngle,eAngle);
          ctx.fill();
        } else if ( (this.currentLevel[r][c] === 'B') && (this.timeToBlink() === false) ) {  // bonus dots
          ctx.beginPath();
          ctx.fillStyle = Colors.dotPink;
          ctx.arc( (spacing + c * spacing) , (spacing + r * spacing) , 14 , 0 , Math.PI*2 ); // ctx.arc(x,y,radius,sAngle,eAngle);
          ctx.fill();
        } else {
          // it's not a dot
        }
      }
    }
  };

  this.drawWalls1 = function(someColor) {
    let ctx = State.ctx;
    let s = State.gridSpacing;
    let corner = 10;
    let half = s/2;
    let color = someColor;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    // roundRect(x, y, width, height, radius);
    // roundRect(s*, s*, s*, s*, corner);
    // ctx.arcTo(s*,s*,s*,s*,half);
    // ctx.lineTo(s*,s*);

    { // outter border
      ctx.beginPath();
      ctx.moveTo(s*0+half,s*14-half);

      ctx.lineTo(s*5,s*14-half);
      ctx.arcTo(s*5+half,s*14-half,s*5+half,s*13,half);
      ctx.lineTo(s*5+half,s*11);
      ctx.arcTo(s*5+half,s*10+half,s*5,s*10+half,half);
      ctx.lineTo(s*1+half,s*10+half);
      ctx.arcTo(s*0+half,s*10+half,s*0+half,s*9+half,s);

      ctx.lineTo(s*0+half,s*1+half);
      ctx.arcTo(s*0+half,s*0+half,s*1+half,s*0+half,s);
      ctx.lineTo(s*27+half,s*0+half);
      ctx.arcTo(s*28+half,s*0+half,s*28+half,s*1,s);
      ctx.lineTo(s*28+half,s*9+half);

      ctx.arcTo(s*28+half,s*10+half,s*27,s*10+half,s);
      ctx.lineTo(s*24,s*10+half);
      ctx.arcTo(s*23+half,s*10+half,s*23+half,s*11,half);
      ctx.lineTo(s*23+half, s*13);
      ctx.arcTo(s*23+half,s*13+half,s*24,s*13+half,half);
      ctx.lineTo(s*28+half,s*13+half);

      ctx.moveTo(s*28+half,s*16+half); // middle

      ctx.lineTo(s*24,s*16+half);
      ctx.arcTo(s*23+half,s*16+half,s*23+half,s*17,half);
      ctx.lineTo(s*23+half,s*19);
      ctx.arcTo(s*23+half,s*19+half,s*24,s*19+half,half);
      ctx.lineTo(s*27+half,s*19+half);
      ctx.arcTo(s*28+half,s*19+half,s*28+half,s*21,s);

      ctx.lineTo(s*28+half,s*30+half);
      ctx.arcTo(s*28+half,s*31+half,s*27+half,s*31+half,s);
      ctx.lineTo(s*1+half,s*31+half);
      ctx.arcTo(s*0+half,s*31+half,s*0+half,s*30+half,s);
      ctx.lineTo(s*0+half,s*20+half);

      ctx.arcTo(s*0+half,s*19+half,s*1+half,s*19+half,s);
      ctx.lineTo(s*5,s*19+half);
      ctx.arcTo(s*5+half,s*19+half,s*5+half,s*19,half);
      ctx.lineTo(s*5+half,s*17);
      ctx.arcTo(s*5+half,s*16+half,s*5,s*16+half,half);
      ctx.lineTo(s*0+half,s*16+half);

      ctx.stroke();
    } // end outter border

    { // inner border
        ctx.beginPath();
        ctx.moveTo(s*0+half,s*14);

        ctx.lineTo(s*6-half,s*14);
        ctx.arcTo(s*6,s*14,s*6,s*14-half,half);
        ctx.lineTo(s*6,s*10+half);
        ctx.arcTo(s*6,s*10,s*6-half,s*10,half);
        ctx.lineTo(s*2,s*10);
        ctx.arcTo(s*1,s*10,s*1,s*10-half,half);
        ctx.lineTo(s*1,s*1+half);
        ctx.arcTo(s*1,s*1,s*1+half,s*1,half);

        ctx.lineTo(s*14-half,s*1);
        ctx.arcTo(s*14,s*1,s*14,s*2,half);
        ctx.lineTo(s*14,s*5-half);
        ctx.arcTo(s*14,s*5,s*14+half,s*5,half);
        ctx.arcTo(s*15,s*5,s*15,s*5-half,half);
        ctx.lineTo(s*15,s*1+half);
        ctx.arcTo(s*15,s*1,s*16-half,s*1,half);
        ctx.lineTo(s*27,s*1);

        ctx.arcTo(s*28,s*1,s*28,s*2-half,half);
        ctx.arcTo(s*28,s*10,s*28-half,s*10,half);
        ctx.lineTo(s*24-half,s*10);
        ctx.arcTo(s*23,s*10,s*23,s*10+half,half);
        ctx.lineTo(s*23,s*14-half);
        ctx.arcTo(s*23,s*14,s*23+half,s*14,half);
        ctx.lineTo(s*28+half,s*14);

        ctx.moveTo(s*28+half,s*16);  // center gap

        ctx.lineTo(s*23+half,s*16);
        ctx.arcTo(s*23,s*16,s*23,s*16+half,half);
        ctx.lineTo(s*23,s*20-half);
        ctx.arcTo(s*23,s*20,s*23+half,s*20,half);
        ctx.lineTo(s*28-half,s*20);
        ctx.arcTo(s*28,s*20,s*28,s*20+half,half);
        ctx.lineTo(s*28,s*25-half);

        ctx.arcTo(s*28,s*25,s*27+half,s*25,half);
        ctx.lineTo(s*26+half,s*25);
        ctx.arcTo(s*26,s*25,s*26,s*25+half,half);
        ctx.arcTo(s*26,s*26,s*26+half,s*26,half);
        ctx.lineTo(s*28-half,s*26);
        ctx.arcTo(s*28,s*26,s*28,s*26+half,half);

        ctx.lineTo(s*28,s*30);
        ctx.arcTo(s*28,s*31,s*28-half,s*31,half);
        ctx.lineTo(s*2,s*31);
        ctx.arcTo(s*1,s*31,s*1,s*30,half);
        ctx.lineTo(s*1,s*27);

        ctx.arcTo(s*1,s*26,s*1+half,s*26,half);
        ctx.lineTo(s*3-half,s*26);
        ctx.arcTo(s*3,s*26,s*3,s*26-half,half);
        ctx.arcTo(s*3,s*25,s*-half,s*25,half);
        ctx.lineTo(s*1+half,s*25);
        ctx.arcTo(s*1,s*25,s*1,s*25-half,half);

        ctx.lineTo(s*1,s*21);
        ctx.arcTo(s*1,s*20,s*1+half,s*20,half);
        ctx.lineTo(s*5+half,s*20);
        ctx.arcTo(s*6,s*20,s*6,s*19+half,half);
        ctx.lineTo(s*6,s*16+half);
        ctx.arcTo(s*6,s*16,s*6-half,s*16,half);
        ctx.lineTo(s*0+half,s*16);

        ctx.stroke();
    } // end inner border

    { // islands
      roundRect(s*3, s*3, s*3, s*2, corner);
      roundRect(s*8, s*3, s*4, s*2, corner);
      roundRect(s*17, s*3, s*4, s*2, corner);
      roundRect(s*23, s*3, s*3, s*2, corner);
      //
      roundRect(s*3, s*7, s*3, s*1, corner);

      ctx.beginPath();
      ctx.moveTo(s*8,s*8);
      ctx.arcTo(s*8,s*7,s*8+half,s*7,half);
      ctx.arcTo(s*9,s*7,s*9,s*7+half,half);
      ctx.lineTo(s*9,s*9+half);
      ctx.arcTo(s*9,s*10,s*9+half,s*10,half);
      ctx.lineTo(s*11+half,s*10);
      ctx.arcTo(s*12,s*10,s*12,s*10+half,half);
      ctx.arcTo(s*12,s*11,s*12-half,s*11,half);
      ctx.lineTo(s*9+half,s*11);
      ctx.arcTo(s*9,s*11,s*9,s*11+half,half);
      ctx.lineTo(s*9,s*13+half);
      ctx.arcTo(s*9,s*14,s*8+half,s*14,half);
      ctx.arcTo(s*8,s*14,s*8,s*13+half,half);
      ctx.lineTo(s*8,s*8);
      ctx.stroke();

      ctx.beginPath();  // middle T1
      ctx.moveTo(s*11+half,s*7);
      ctx.lineTo(s*17+half,s*7);
      ctx.arcTo(s*18,s*7,s*18,s*7+half,half);
      ctx.arcTo(s*18,s*8,s*17+half,s*8,half);
      ctx.lineTo(s*15+half,s*8);
      ctx.arcTo(s*15,s*8,s*15,s*8+half,half);
      ctx.lineTo(s*15,s*10+half);
      ctx.arcTo(s*15,s*11,s*14+half,s*11,half);
      ctx.arcTo(s*14,s*11,s*14,s*10+half,half);
      ctx.lineTo(s*14,s*8+half);
      ctx.arcTo(s*14,s*8,s*13+half,s*8,half);
      ctx.lineTo(s*11+half,s*8);
      ctx.arcTo(s*11,s*8,s*11,s*7+half,half);
      ctx.arcTo(s*11,s*7,s*11+half,s*7,half);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(s*20,s*8);
      ctx.arcTo(s*20,s*7,s*20+half,s*7,half);
      ctx.arcTo(s*21,s*7,s*21,s*7+half,half);
      ctx.lineTo(s*21,s*13+half);
      ctx.arcTo(s*21,s*14,s*20+half,s*14,half);
      ctx.arcTo(s*20,s*14,s*20,s*13+half,half);
      ctx.lineTo(s*20,s*11+half);
      ctx.arcTo(s*20,s*11,s*19+half,s*11,half);
      ctx.lineTo(s*17+half,s*11);
      ctx.arcTo(s*17,s*11,s*17,s*10+half,half);
      ctx.arcTo(s*17,s*10,s*17+half,s*10,half);
      ctx.lineTo(s*19+half,s*10);
      ctx.arcTo(s*20,s*10,s*20,s*9+half,half);
      ctx.lineTo(s*20,s*8);
      ctx.stroke();

      roundRect(s*23, s*7, s*3, s*1, corner);

      // GHOST HOUSE
      ctx.beginPath();
      ctx.moveTo(s*13+12.5,s*13);  // draw left of exit, counterclockwise around the house
      ctx.lineTo(s*11,s*13);
      ctx.lineTo(s*11,s*17);
      ctx.lineTo(s*18,s*17);
      ctx.lineTo(s*18,s*13);
      ctx.lineTo(s*15+12.5,s*13);
      ctx.moveTo(s*13+12.5,s*13+half);
      ctx.lineTo(s*12-half,s*13+half);
      ctx.lineTo(s*12-half,s*17-half);
      ctx.lineTo(s*18-half,s*17-half);
      ctx.lineTo(s*18-half,s*13+half);
      ctx.lineTo(s*15+12.5,s*13+half);
      ctx.stroke();
      //  ghost house exit
      ctx.beginPath();
      ctx.fillStyle = Colors.ghostPink;
      ctx.rect(s*13+12.5,s*13+2,s*2,8); // rect(x y width height)
      ctx.fill();

      ctx.strokeStyle = color;

      // roundRect(x, y, width, height, radius);
      roundRect(s*8, s*16, s*1, s*4, corner);

      ctx.beginPath();  // middle T2
      ctx.moveTo(s*11+half,s*19);
      ctx.lineTo(s*17+half,s*19);
      ctx.arcTo(s*18,s*19,s*18,s*19+half,half);
      ctx.arcTo(s*18,s*20,s*17+half,s*20,half);
      ctx.lineTo(s*15+half,s*20);
      ctx.arcTo(s*15,s*20,s*15,s*20+half,half);
      ctx.lineTo(s*15,s*22+half);
      ctx.arcTo(s*15,s*23,s*14+half,s*23,half);
      ctx.arcTo(s*14,s*23,s*14,s*22+half,half);
      ctx.lineTo(s*14,s*20+half);
      ctx.arcTo(s*14,s*20,s*13+half,s*20,half);
      ctx.lineTo(s*11+half,s*20);
      ctx.arcTo(s*11,s*20,s*11,s*19+half,half);
      ctx.arcTo(s*11,s*19,s*11+half,s*19,half);
      ctx.stroke();

      roundRect(s*20, s*16, s*1, s*4, corner);

      ctx.beginPath();
      ctx.moveTo(s*3+half,s*22);
      ctx.lineTo(s*5+half,s*22);
      ctx.arcTo(s*6,s*22,s*6,s*22+half,half);
      ctx.lineTo(s*6,s*25+half);
      ctx.arcTo(s*6,s*26,s*5+half,s*26,half);
      ctx.arcTo(s*5,s*26,s*5,s*25+half,half);
      ctx.lineTo(s*5,s*23+half);
      ctx.arcTo(s*5,s*23,s*4+half,s*23,half);
      ctx.lineTo(s*3+half,s*23);
      ctx.arcTo(s*3,s*23,s*3,s*22+half,half);
      ctx.arcTo(s*3,s*22,s*3+half,s*22,half);
      ctx.stroke();

      roundRect(s*8, s*22, s*4, s*1, corner);

      roundRect(s*17, s*22, s*4, s*1, corner);

      ctx.beginPath();
      ctx.moveTo(s*23,s*23);
      ctx.arcTo(s*23,s*22,s*23+half,s*22,half);
      ctx.lineTo(s*25+half,s*22);
      ctx.arcTo(s*26,s*22,s*26,s*22+half,half);
      ctx.arcTo(s*26,s*23,s*25+half,s*23,half);
      ctx.lineTo(s*25,s*23);
      ctx.arcTo(s*24,s*23,s*24,s*23+half,half);
      ctx.lineTo(s*24,s*25+half);
      ctx.arcTo(s*24,s*26,s*23+half,s*26,half);
      ctx.arcTo(s*23,s*26,s*23,s*25+half,half);
      ctx.lineTo(s*23,s*23);
      ctx.stroke();

      ctx.beginPath();  // bot left
      ctx.moveTo(s*3+half,s*28);
      ctx.lineTo(s*7+half,s*28);
      ctx.arcTo(s*8,s*28,s*8,s*27+half,half);
      ctx.lineTo(s*8,s*25+half);
      ctx.arcTo(s*8,s*25,s*8+half,s*25,half);
      ctx.arcTo(s*9,s*25,s*9,s*25+half,half);
      ctx.lineTo(s*9,s*27+half);
      ctx.arcTo(s*9,s*28,s*9+half,s*28,half);
      ctx.lineTo(s*11+half,s*28);
      ctx.arcTo(s*12,s*28,s*12,s*28+half,half);
      ctx.arcTo(s*12,s*29,s*11+half,s*29,half);
      ctx.lineTo(s*3+half,s*29);
      ctx.arcTo(s*3,s*29,s*3,s*28+half,half);
      ctx.arcTo(s*3,s*28,s*3+half,s*28,half);
      ctx.stroke();

      ctx.beginPath();  // bottom T3
      ctx.moveTo(s*11+half,s*25);
      ctx.lineTo(s*17+half,s*25);
      ctx.arcTo(s*18,s*25,s*18,s*25+half,half);
      ctx.arcTo(s*18,s*26,s*17+half,s*26,half);
      ctx.lineTo(s*15+half,s*26);
      ctx.arcTo(s*15,s*26,s*15,s*26+half,half);
      ctx.lineTo(s*15,s*28+half);
      ctx.arcTo(s*15,s*29,s*14+half,s*29,half);
      ctx.arcTo(s*14,s*29,s*14,s*28+half,half);
      ctx.lineTo(s*14,s*26+half);
      ctx.arcTo(s*14,s*26,s*13+half,s*26,half);
      ctx.lineTo(s*11+half,s*26);
      ctx.arcTo(s*11,s*26,s*11,s*25+half,half);
      ctx.arcTo(s*11,s*25,s*11+half,s*25,half);
      ctx.stroke();

      ctx.beginPath();  // bot right
      ctx.moveTo(s*17+half,s*28);
      ctx.lineTo(s*19+half,s*28);
      ctx.arcTo(s*20,s*28,s*20,s*27+half,half);
      ctx.lineTo(s*20,s*25+half);
      ctx.arcTo(s*20,s*25,s*20+half,s*25,half);
      ctx.arcTo(s*21,s*25,s*21,s*25+half,half);
      ctx.lineTo(s*21,s*27+half);
      ctx.arcTo(s*21,s*28,s*21+half,s*28,half);
      ctx.lineTo(s*25+half,s*28);
      ctx.arcTo(s*26,s*28,s*26,s*28+half,half);
      ctx.arcTo(s*26,s*29,s*25+half,s*29,half);
      ctx.lineTo(s*17+half,s*29);
      ctx.arcTo(s*17,s*29,s*17,s*28+half,half);
      ctx.arcTo(s*17,s*28,s*17+half,s*28,half);
      ctx.stroke();

    } // end islands

  };

  this.drawWalls2 = function() {
    let ctx = State.ctx;
    let spacing = State.gridSpacing;
    for (let r = 0; r < this.currentLevel.length; r++) {
      for (let c = 0; c < this.currentLevel[r].length; c++) {
        if (this.currentLevel[r][c] === '#') {
          ctx.beginPath();
          ctx.fillStyle = Colors.blue;
          ctx.lineWidth = 1;
          ctx.rect( (spacing-5 + c * spacing), (spacing-5 + r * spacing), 10, 10 ); // x y width height
          ctx.fill();
        } else if (this.currentLevel[r][c] === 'W') {
          ctx.beginPath();
          ctx.fillStyle = Colors.ghostPink;
          ctx.rect( (spacing-10 + c * spacing), (spacing-2 + r * spacing), 22, 5 ); // x y width height
          ctx.fill();
        } else if (this.currentLevel[r][c] === 'T') {
          ctx.beginPath();
          ctx.fillStyle = Colors.ghostAqua;
          ctx.rect( (spacing-2 + c * spacing), (spacing-10 + r * spacing), 4, 20 ); // x y width height
          ctx.fill();
        } else {
          // nothin
        }
      }
    }
  };

  this.drawWallsBG = function() {

    if (this.lvlBlinkOn === true) {
      if ((performance.now() % this.lvlBlinkDur) <= 16.67) {
        if (this.lvlImageSelect === 1) {
          this.lvlImageSelect = 2;
        } else {
          this.lvlImageSelect = 1;
        }
      }
    }

    if (this.lvlImageSelect === 1) {
      State.ctx.putImageData(this.lvlImage1,0,0);
    } else if (this.lvlImageSelect === 2) {
      State.ctx.putImageData(this.lvlImage2,0,0);
    } else {
      if (LOGS) console.log('lvlImageSelect prob');
    }

  };

  this.draw = function() {
    if (this.drawMode === 1) {
      this.drawWalls1(Colors.blue);
    } else if (this.drawMode === 2) {
      this.drawWalls2();
    } else if (this.drawMode === 3) {
      this.drawWallsBG();
    }
    this.drawDots();
  }; // draw

} // level


// MAP LEGEND
// 0 = dot
// # = wall
// B = big dot
// - = space
// S = start
// W = white wall
// T = teleport
