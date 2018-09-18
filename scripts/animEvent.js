/* jshint esversion: 6 */

// an Animation Event is a scripted animation object that can be fired off and forgotten...
//   making animations simpler/easier to organize and control
// function AnimEvent(x,y,duration) {
//   this.startX = x;
//   this.startX = y;
//   this.dur = duration;
//   this.startTime = undefined;
//
//   this.init = function() {
//     this.startTime = performance.now();
//   };
//
//   this.start = function() {
//   };
//
//   this.finish = function() {
//   };
//
//   this.draw = function() {
//   };
//
//   this.update = function() {
//   };
//
// }


function SparkAnim(ctx,x,y,c='rand') {
  this.ctx = ctx;
  this.startX = x;
  this.startY = y;
  this.dur = 3000;
  this.color = c;
  this.sparkles = undefined;
  this.startTime = undefined;
  this.complete = false;

  this.init = function() {
    this.complete = false;
    this.startTime = performance.now();
    this.sparkles = [];
    for (var i = 0; i < 600; i++) {
      let color;
      let randX =  this.startX + getRandomIntInclusive(-15,15);
      let randY =  this.startY + getRandomIntInclusive(-15,15);
      let randLen =  getRandomIntInclusive(10,30);
      let randAngle = getRandomIntInclusive(1,360);
      let randVel = getRandomIntInclusive(2,5) / 30;
      if (this.color === 'rand') {
        color = randColor('rgba');
      } else {
        color = this.color;
      }
      this.sparkles.push({  x:     randX,
                            y:     randY,
                            angle: randAngle,
                            len:   randLen,
                            vel:   randVel,
                            color: color
                            });
    } // for
    // console.log('this.sparkles = ', this.sparkles);
  };

  this.finish = function() {
    // clean up and start new funk
    console.log('sparkAnim finished');
  };

  this.draw = function() {
    // console.log('drawing spark');
    if (this.complete === false) {
        let sp = this.sparkles;
        for (let i = 0; i < sp.length; i++) {
          ctx.lineWidth = getRandomIntInclusive(1,12);
          ctx.strokeStyle = sp[i].color;
          // ctx.strokeStyle = Colors.pacYellow;
          // ctx.strokeStyle = randColor('rgba'); // full random color madness
          let x = sp[i].x;
          let y = sp[i].y;
          let angle = sp[i].angle;
          let len = sp[i].len;
          // single ray
          ctx.beginPath();
          ctx.moveTo( x , y );
          ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
          ctx.stroke();
        }
    }
  };

  this.update = function() {
    // console.log('updating spark');
    if (this.complete === false) {
        let sp = this.sparkles;
        if ((performance.now() - this.startTime) > this.dur) {
          this.complete = true;
          this.finish();
        } else {
          let sp = this.sparkles;
          for (let i = 0; i < sp.length; i++) {
            let angle = sp[i].angle;
            let len = sp[i].len;
            let vel = sp[i].vel;
            sp[i].x += (vel*(len*Math.cos(angle)));
            sp[i].y += (vel*(len*Math.sin(angle)));
          }
        }
    }
  };

}
