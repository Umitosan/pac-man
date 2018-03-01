/*jshint esversion: 6 */

function Level() {
  this.currentLevel = level1;

  this.init = function() {
    console.log("currentLevel = ", this.currentLevel);
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
    roundRect(s*2, s*2, s*3, s*2, corner);
    roundRect(s*7, s*2, s*4, s*2, corner);
    roundRect(s*13, 0, s*1, s*4, corner);
    roundRect(s*16, s*2, s*4, s*2, corner);
    roundRect(s*22, s*2, s*3, s*2, corner);

    roundRect(s*2, s*6, s*3, s*1, corner);
    roundRect(s*7, s*6, s*1, s*7, corner);
    roundRect(s*10, s*6, s*7, s*1, corner);
    roundRect(s*19, s*6, s*1, s*7, corner);
    roundRect(s*22, s*6, s*3, s*1, corner);

    roundRect(s*8, s*9, s*3, s*1, corner);
    roundRect(s*13, s*7, s*1, s*3, corner);
    roundRect(s*16, s*9, s*3, s*1, corner);

    ctx.clearRect(s*8-2, s*9+2, s*1-4, s*1-4);
    ctx.clearRect(s*13+2, s*7-4, s*1-4, s*1);
    ctx.clearRect(s*19-4, s*9+2, s*1-4, s*1-4);

    roundRect(0, s*9, s*5, s*4, corner); // outter
    roundRect(0+10, s*9+10, s*5-20, s*4-20, corner); // inner
    roundRect(s*22, s*9, s*5, s*4, corner);  // outter
    roundRect(s*22+10, s*9+10, s*5-20, s*4-20, corner);  // inner

    // ctx.rect(x,y,width,height)
    ctx.beginPath();
    ctx.rect(s*10,s*12,s*7,s*4);
    ctx.rect(s*10+10,s*12+10,s*6+5,s*3+5); // inner
    ctx.stroke();
    ctx.beginPath();
    ctx.fillStyle = Colors.white;
    ctx.strokeStyle = Colors.white;
    ctx.rect(s*12+14,s*12,s*2,12); // white exit
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = Colors.blue;

    // roundRect(x, y, width, height, radius);
    roundRect(0, s*15, s*5, s*4, corner); // outter
    roundRect(0+10, s*15+10, s*5-20, s*4-20, corner); // inner
    roundRect(s*22, s*15, s*5, s*4, corner);  // outter
    roundRect(s*22+10, s*15+10, s*5-20, s*4-20, corner); // inner

    roundRect(s*7, s*15, s*1, s*4, corner);
    roundRect(s*10, s*18, s*7, s*1, corner);
    roundRect(s*13, s*19, s*1, s*3, corner);
    roundRect(s*19, s*15, s*1, s*4, corner);
    roundRect(s*2, s*21, s*2, s*1, corner);
    roundRect(s*4, s*21, s*1, s*4, corner);
    roundRect(s*7, s*21, s*4, s*1, corner);
    roundRect(s*16, s*21, s*4, s*1, corner);
    roundRect(s*22, s*21, s*1, s*4, corner);
    roundRect(s*23, s*21, s*2, s*1, corner);

    roundRect(0, s*24, s*2, s*1, corner);
    roundRect(s*2, s*27, s*9, s*1, corner);
    roundRect(s*7, s*24, s*1, s*3, corner);
    roundRect(s*10, s*24, s*7, s*1, corner);
    roundRect(s*13, s*25, s*1, s*3, corner);
    roundRect(s*16, s*27, s*9, s*1, corner);
    roundRect(s*19, s*24, s*1, s*3, corner);
    roundRect(s*25, s*24, s*2, s*1, corner);

    ctx.clearRect(s*4-4, s*21+2, s*1-4, s*1-4);
    ctx.clearRect(s*13+2, s*19-4, s*1-4, s*1);
    ctx.clearRect(s*23-4, s*21+2, s*1-4, s*1-4);

    ctx.clearRect(s*7+2, s*27-6, s*1-4, s*1-4);
    ctx.clearRect(s*13+2, s*25-6, s*1-4, s*1-4);
    ctx.clearRect(s*19+2, s*27-6, s*1-4, s*1-4);

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
}


// 0 = dot
// # = wall
// B = big dot
// - = space
// S = start
// W = white wall

var level1 = [
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ],
  [ 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ],
  ['B','#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#','B'],
  [ 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ], // 5
  [ 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ],
  [ 0 ,'#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#', 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ],
  ['#','#','#','#','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','#','#','#','#'],
  ['-','-','-','-','#', 0 ,'#','#','#','#','#','-','#','#','-','#','#','#','#','#', 0 ,'#','-','-','-','-'], // 10
  ['-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-'],
  ['-','-','-','-','#', 0 ,'#','#','-','#','#','#','W','W','#','#','#','-','#','#', 0 ,'#','-','-','-','-'],
  ['#','#','#','#','#', 0 ,'#','#','-','#','-','-','-','-','-','-','#','-','#','#', 0 ,'#','#','#','#','#'],
  ['-','-','-','-','-', 0 ,'-','-','-','#','-','-','-','-','-','-','#','-','-','-', 0 ,'-','-','-','-','-'], // center
  ['#','#','#','#','#', 0 ,'#','#','-','#','-','-','-','-','-','-','#','-','#','#', 0 ,'#','#','#','#','#'], // 15
  ['-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-'],
  ['-','-','-','-','#', 0 ,'#','#','-','-','-','-','-','-','-','-','-','-','#','#', 0 ,'#','-','-','-','-'],
  ['-','-','-','-','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','-','-','-','-'],
  ['#','#','#','#','#', 0 ,'#','#','-','#','#','#','#','#','#','#','#','-','#','#', 0 ,'#','#','#','#','#'],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ], // 20
  [ 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ],
  [ 0 ,'#','#','#','#', 0 ,'#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#', 0 ,'#','#','#','#', 0 ],
  ['B', 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'S','S', 0 , 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 ,'B'],
  ['#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#'],
  ['#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#', 0 ,'#','#'], // 25
  [ 0 , 0 , 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 ,'#','#', 0 , 0 , 0 , 0 , 0 , 0 ],
  [ 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ],
  [ 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ,'#','#', 0 ,'#','#','#','#','#','#','#','#','#','#', 0 ],
  [ 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ]
];
