/*jshint esversion: 6 */

function Level() {

  this.init = function() {
  };
  this.drawDots = function() {
    for (let i = 0; i < State.gridWidth; i++) {
      ctx.beginPath();
      ctx.fillStyle = Colors.white;
      // ctx.arc(x,y,radius,sAngle,eAngle);
      ctx.arc(State.gridSpacing+i*State.gridSpacing,State.gridSpacing,4,0,Math.PI*2);
      ctx.fill();
    }
    for (let i = 0; i < State.gridHeight; i++) {
      ctx.beginPath();
      ctx.fillStyle = Colors.white;
      // ctx.arc(x,y,radius,sAngle,eAngle);
      ctx.arc(State.gridSpacing,State.gridSpacing+i*State.gridSpacing,4,0,Math.PI*2);
      ctx.fill();
    }
  };
  this.drawWalls = function() {
    let s = State.gridSpacing;
    // roundRect(x, y, width, height, radius);
    ctx.strokeStyle = Colors.blue;
    ctx.lineWidth = 3;
    roundRect(s*2, s*2, s*3, s*2, 8);
    roundRect(s*7, s*2, s*4, s*2, 8);
    roundRect(s*16, s*2, s*4, s*2, 8);
    roundRect(s*22, s*2, s*3, s*2, 8);
  };
  this.draw = function() {
    this.drawDots();
    this.drawWalls();
  };
}
