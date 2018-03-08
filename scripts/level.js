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
          ctx.arc( (State.gridSpacing + c * State.gridSpacing) , (State.gridSpacing + r * State.gridSpacing) , 3 , 0 , Math.PI*2 );
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
    let half = s/2;

    ctx.strokeStyle = Colors.blue;
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
    } // outter border

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
    } // inner border

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

      // GHOST HOME
      ctx.beginPath();
      ctx.moveTo(s*13,s*13);
      ctx.lineTo(s*11,s*13);
      ctx.lineTo(s*11,s*17);
      ctx.lineTo(s*18,s*17);
      ctx.lineTo(s*18,s*13);
      ctx.lineTo(s*16,s*13);
      ctx.moveTo(s*13,s*13+half);
      ctx.lineTo(s*12-half,s*13+half);
      ctx.lineTo(s*12-half,s*17-half);
      ctx.lineTo(s*18-half,s*17-half);
      ctx.lineTo(s*18-half,s*13+half);
      ctx.lineTo(s*16,s*13+half);
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = Colors.white;
      ctx.rect(s*13,s*13+2,s*3,8); // white exit
      ctx.fill();

      ctx.strokeStyle = Colors.blue;

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

      roundRect(s*3, s*28, s*9, s*1, corner);
      roundRect(s*8, s*25, s*1, s*3, corner);

      // roundRect(s*11, s*25, s*7, s*1, corner);
      // roundRect(s*14, s*26, s*1, s*3, corner);

      ctx.beginPath();  // middle T3
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

      roundRect(s*17, s*28, s*9, s*1, corner);
      roundRect(s*20, s*25, s*1, s*3, corner);
    } // islands

  };

  this.drawWalls2 = function() {
    for (let r = 0; r < this.currentLevel.length; r++) {
      for (let c = 0; c < this.currentLevel[r].length; c++) {
        if (this.currentLevel[r][c] === '#') {
          ctx.beginPath();
          ctx.fillStyle = Colors.blue;
          ctx.lineWidth = 1;
          ctx.rect( (State.gridSpacing-5 + c * State.gridSpacing), (State.gridSpacing-5 + r * State.gridSpacing), 10, 10 ); // x y width height
          ctx.fill();
        } else if (this.currentLevel[r][c] === 'W') {
          ctx.beginPath();
          ctx.fillStyle = Colors.white;
          ctx.rect( (State.gridSpacing-10 + c * State.gridSpacing), (State.gridSpacing-2 + r * State.gridSpacing), 22, 5 ); // x y width height
          ctx.fill();
        } else if (this.currentLevel[r][c] === 'T') {
          ctx.beginPath();
          ctx.fillStyle = Colors.aqua;
          ctx.rect( (State.gridSpacing-2 + c * State.gridSpacing), (State.gridSpacing-10 + r * State.gridSpacing), 4, 20 ); // x y width height
          ctx.fill();
        } else {
          // nothin
        }
      }
    }
  };

  this.draw = function() {
    this.drawDots();
    if (myGame.lvlOnType === 1) {
      this.drawWalls1();
    } else if (myGame.lvlOnType === 2) {
      this.drawWalls2();
    } else {
      // don't draw level
    }
  };

} // level


// MAP LEGEND
// 0 = dot
// # = wall
// B = big dot
// - = space
// S = start
// W = white wall
// T = teleport

var level1 = [
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
  ['#','#','#','#','#','#', 0 ,'#','#','-','#','-','-','-','-','-','-','#','-','#','#', 0 ,'#','#','#','#','#','#'],
  ['T','-','-','-','-','-', 0 ,'-','-','-','#','-','-','-','-','-','-','#','-','-','-', 0 ,'-','-','-','-','-','T'],
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
  ['#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#','#'] // 30
];
