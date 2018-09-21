/* jshint esversion: 6 */

function SparkAnim(ctx,x,y,quant,color='rand') {
  this.ctx = ctx;
  this.startX = x;
  this.startY = y;
  this.quantity = quant;
  this.color = color;
  this.sparkles = undefined;

  // timing
  this.complete = false;
  this.startTime = undefined;
  this.totalDur = 3000;
  this.pauseBegin = undefined;
  this.pauseElapsedTime = 0;

  this.init = function() {
    this.complete = false;
    this.startTime = performance.now();
    this.totalDur = 3000;
    this.pauseBegin = undefined;
    this.pauseElapsedTime = 0;
    this.sparkles = [];
    for (let i = 0; i < this.quantity; i++) {
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

  this.pauseIt = function() {
    this.pauseElapsedTime = (performance.now() - this.pauseBegin);
  };

  this.unpauseIt = function() {
    this.pauseBegin = (performance.now() - this.pauseElapsedTime);
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
          ctx.moveTo(x, y);
          ctx.lineTo( x+(len*Math.cos(angle)) , y+(len*Math.sin(angle)) );
          ctx.stroke();
        }
    }
  };

  this.update = function() {
    // console.log('updating spark');
    if (this.complete === false) {
        let sp = this.sparkles;
        if (this.pauseElapsedTime > this.totalDur) {
          this.complete = true;
          this.finish();
        } else {
          this.pauseElapsedTime = (performance.now() - this.pauseBegin);
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


function PhaseAnim(ctx,x,y,quant,color='rand') {
  this.ctx = ctx;
  this.startX = x;
  this.startY = y;
  this.quantity = quant;
  this.color = color;
  this.lines = undefined;

  // timing
  this.complete = false;
  this.startTime = undefined;
  this.totalDur = 3000;
  this.pauseBegin = undefined;
  this.pauseElapsedTime = 0;

  this.init = function() {
    this.complete = false;
    this.startTime = performance.now();
    this.totalDur = 3000;
    this.pauseBegin = undefined;
    this.pauseElapsedTime = 0;
    this.lines = [];

    for (var i = 0; i < this.quantity; i++) {
      let randX = getRandomIntInclusive(-25,25);
      let randY = getRandomIntInclusive(-25,25);
      let randW = getRandomIntInclusive(20,300);
      let randH = getRandomIntInclusive(2,18);
      let randHcoef = randSign();
      let col;
      if (this.color === 'rand') {
        col = randColor('rgba');
      } else {
        color = this.color;
      }
      this.lines.push({ x: (randX + this.startX),
                        y: (randY + this.startY),
                        width: randW,
                        height: randH,
                        color: col,
                        hCoef: randHcoef
                        });
    }
  };

  this.pauseIt = function() {
    this.pauseElapsedTime = (performance.now() - this.pauseBegin);
  };

  this.unpauseIt = function() {
    this.pauseBegin = (performance.now() - this.pauseElapsedTime);
  };

  this.finish = function() {
    // clean up and start new funk
    console.log('phaseAnim finished');
  };

  this.draw = function() {
    console.log('draw phase anim');
    if (this.complete === false) {
      let lines = this.lines;
      for (let i = 0; i < lines.length; i++) {
        ctx.lineWidth = lines[i].height;
        let x = lines[i].x;
        let y = lines[i].y;
        let w = lines[i].width;
        ctx.strokeStyle = lines[i].color;
        ctx.beginPath();
        ctx.moveTo( (x-(w/2)) , y );
        ctx.lineTo( (x+(w/2)) , y );
        ctx.stroke();
      } // for
    } // if
  };

  this.update = function() {
    if (this.complete === false) {
      let line;
      for (let i = 0; i < this.lines.length; i++) {
        line = this.lines[i];
        // if (line.y+(line.height/2) >= 25) {
        //   line.y -= 2;
        // } else if ((line.y-(line.height/2)) < 25) {
        //   line.y += 2;
        // } else {
        //   // nothin
        // }
        if (line.height >= 20) {
          line.hCoef *= -1;
        } else if (line.height < 2){
          line.hCoef *= -1;
        } else {
          line.height += line.hCoef;
        }
      } // for
    } // if
  };

}
