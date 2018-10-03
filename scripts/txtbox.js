/* jshint esversion: 6 */


function TxtBox(x,y,msg,color,dur,font) {
  this.x = x;
  this.y = y;
  this.font = font;
  this.color = color;
  this.txt = msg;
  this.startTime = null;
  this.durTotal = dur;
  this.show = false;

  this.startTimer = function() {
    this.show = true;
    this.startTime = performance.now();
  };

  this.finishTimer = function() {
    this.show = false;
    this.startTime = null;
  };

  this.on = function() {
    this.show = true;
  };

  this.off = function() {
    this.show = false;
  };

  this.draw = function() {
    var ctx = State.ctx;
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.fillText(this.txt,this.x,this.y);
  };

  this.update = function() {
    // console.log('txt up');
    if ((this.durTotal - (performance.now() - this.startTime)) < 0) {
      this.finishTimer();
      console.log('text finish timer');
    }
  };
} // TxtBox
