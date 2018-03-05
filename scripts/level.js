/*jshint esversion: 6 */

function Level() {
  this.currentLevel = level1;

  this.init = function() {

  };

  this.drawDots = function() {
    for (let r = 0; r < this.currentLevel.length; r++) {
      for (let c = 0; c < this.currentLevel[r].length; c++) {
        if (this.currentLevel[r][c] === 0) { // it's a dot! so print it!
          ctx.beginPath();
          ctx.fillStyle = Colors.white;
          // ctx.arc(x,y,radius,sAngle,eAngle);
          ctx.arc( (State.gridSpacing + c * State.gridSpacing) , (State.gridSpacing + r * State.gridSpacing) , 4 , 0 , Math.PI*2 );
          ctx.fill();
        } else if (this.currentLevel[r][c] === 'B') {  // bonus dots
          ctx.beginPath();
          ctx.fillStyle = Colors.white;
          // ctx.arc(x,y,radius,sAngle,eAngle);
          ctx.arc( (State.gridSpacing + c * State.gridSpacing) , (State.gridSpacing + r * State.gridSpacing) , 12 , 0 , Math.PI*2 );
          ctx.fill();
        } else {
          // it's not a dot
        }
      }
    }
  };

  this.drawWalls1 = function() {
    let s = State.gridSpacing;
    let corner = 10;

    ctx.strokeStyle = Colors.blue;
    ctx.lineWidth = 3;

    // roundRect(x, y, width, height, radius);

    roundRect(0, 0, s*29, s*32, corner);  // border
    roundRect(s*1, s*1, s*27, s*30, corner);  // border

    roundRect(s*3, s*3, s*3, s*2, corner);
    roundRect(s*8, s*3, s*4, s*2, corner);
    roundRect(s*14, s*1, s*1, s*4, corner);
    roundRect(s*17, s*3, s*4, s*2, corner);
    roundRect(s*23, s*3, s*3, s*2, corner);
    //
    roundRect(s*3, s*7, s*3, s*1, corner);

    roundRect(s*8, s*7, s*1, s*7, corner);
    roundRect(s*9, s*10, s*3, s*1, corner);
    ctx.clearRect(s*9-2, s*10+2, s*1-4, s*1-4);

    roundRect(s*11, s*7, s*7, s*1, corner);
    roundRect(s*14, s*8, s*1, s*3, corner);
    ctx.clearRect(s*14+2, s*8-4, s*1-4, s*1);

    roundRect(s*20, s*7, s*1, s*7, corner);
    roundRect(s*17, s*10, s*3, s*1, corner);
    ctx.clearRect(s*20-4, s*10+2, s*1-4, s*1-4);

    roundRect(s*23, s*7, s*3, s*1, corner);

    roundRect(s*1, s*10, s*5, s*4, corner); // outter
    roundRect(s*1+10, s*10+10, s*5-20, s*4-20, corner); // inner
    roundRect(s*23, s*10, s*5, s*4, corner);  // outter
    roundRect(s*23+10, s*10+10, s*5-20, s*4-20, corner);  // inner

    // ctx.rect(x,y,width,height)
    ctx.beginPath();
    ctx.rect(s*11,s*13,s*7,s*4);
    ctx.rect(s*11+10,s*13+10,s*6+5,s*3+5); // inner
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = Colors.white;
    ctx.strokeStyle = Colors.white;
    ctx.rect(s*13+14,s*13,s*2,12); // white exit
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = Colors.blue;

    // roundRect(x, y, width, height, radius);
    roundRect(s*1, s*16, s*5, s*4, corner); // outter
    roundRect(s*1+10, s*16+10, s*5-20, s*4-20, corner); // inner
    roundRect(s*23, s*16, s*5, s*4, corner);  // outter
    roundRect(s*23+10, s*16+10, s*5-20, s*4-20, corner); // inner

    roundRect(s*8, s*16, s*1, s*4, corner);

    roundRect(s*11, s*19, s*7, s*1, corner);
    roundRect(s*14, s*20, s*1, s*3, corner);
    ctx.clearRect(s*14+2, s*20-4, s*1-4, s*1);

    roundRect(s*20, s*16, s*1, s*4, corner);

    roundRect(s*3, s*22, s*2, s*1, corner);
    roundRect(s*5, s*22, s*1, s*4, corner);
    ctx.clearRect(s*5-4, s*22+2, s*1-4, s*1-4);

    roundRect(s*8, s*22, s*4, s*1, corner);

    roundRect(s*17, s*22, s*4, s*1, corner);

    roundRect(s*23, s*22, s*1, s*4, corner);
    roundRect(s*24, s*22, s*2, s*1, corner);
    ctx.clearRect(s*24-4, s*22+2, s*1-4, s*1-4);

    roundRect(s*1, s*25, s*2, s*1, corner);

    roundRect(s*3, s*28, s*9, s*1, corner);
    roundRect(s*8, s*25, s*1, s*3, corner);
    ctx.clearRect(s*8+2, s*28-6, s*1-4, s*1-4);

    roundRect(s*11, s*25, s*7, s*1, corner);
    roundRect(s*14, s*26, s*1, s*3, corner);
    ctx.clearRect(s*14+2, s*26-6, s*1-4, s*1-4);

    roundRect(s*17, s*28, s*9, s*1, corner);
    roundRect(s*20, s*25, s*1, s*3, corner);
    ctx.clearRect(s*20+2, s*28-6, s*1-4, s*1-4);

    roundRect(s*26, s*25, s*2, s*1, corner);

  };

  this.drawWalls2 = function() {
    for (let r = 0; r < this.currentLevel.length; r++) {
      for (let c = 0; c < this.currentLevel[r].length; c++) {
        if (this.currentLevel[r][c] === '#') {
          ctx.beginPath();
          ctx.fillStyle = Colors.blue;
          ctx.strokeStyle = Colors.white;
          ctx.lineWidth = 1;
          ctx.rect( (State.gridSpacing-5 + c * State.gridSpacing), (State.gridSpacing-5 + r * State.gridSpacing), 10, 10 ); // x y width height
          ctx.stroke();
          ctx.fill();
        } else {
          // nothin
        }
      }
    }
  };

  this.draw = function() {
    this.drawDots();
    this.drawWalls1();
    // this.drawWalls2();
  };

} // level


// 0 = dot
// # = wall
// B = big dot
// - = space
// S = start
// W = white wall

var level1 = [
  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'],
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
  ['#','#','#','#','#','#', 0 ,'#','#','-','#','-','-','-','-','-','-','#','-','#','#', 0 ,'#','#','#','#','#','#'],
  ['#','-','-','-','-','-', 0 ,'-','-','-','#','-','-','-','-','-','-','#','-','-','-', 0 ,'-','-','-','-','-','#'], // center
  ['#','#','#','#','#','#', 0 ,'#','#','-','#','-','-','-','-','-','-','#','-','#','#', 0 ,'#','#','#','#','#','#'], // 15
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
  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#']
];
