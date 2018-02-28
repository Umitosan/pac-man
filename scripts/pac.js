/*jshint esversion: 6 */

function Pac(x,y,velocity,diameter,direction,moveState)  {
  this.x = x;
  this.y = y;
  this.vel = velocity;
  this.diameter = diameter;
  this.radius = diameter/2;
  this.mouthSize = getRadianAngle(60);
  this.maxMouthSize = getRadianAngle(60);
  this.minMouthSize = getRadianAngle(2);
  this.mouthVel = getRadianAngle(2); // 2 degree in radians
  this.direction = direction;
  this.rotateFace = 0;
  this.moveState = moveState;
  this.color = Colors.pacYellow;
  this.lineW = 2;

  this.init = function() {
    this.rotatePacFace();
  }; // init

  this.toggleState = function() {
    if (this.moveState === 'go') {
      this.moveState = 'stop';
      myGame.savedLastUpdate = performance.now() - myGame.lastUpdate;
    } else if (this.moveState === 'stop') {
      this.moveState = 'go';
    } else {
      // nothin
    }
    console.log('pac state = ', this.moveState);
  };

  this.inBounds = function() {
    var bounds;
    if ( (this.direction === 'left') && (this.x - Math.abs(this.vel) - this.radius < 2) ) {
      bounds = false;
    } else if ( (this.direction === 'right') && (this.x + this.vel + this.radius >= CANVAS.width-2) ) {
      bounds = false;
    } else if ( (this.direction === 'up') && (this.y - Math.abs(this.vel) - this.radius < 2) ) {
      bounds = false;
    } else if ( (this.direction === 'down') && (this.y + this.vel + this.radius >= CANVAS.height-2) ) {
      bounds = false;
    } else {
      bounds = true;
    }
    return bounds;
  }; // inBounds

  this.changeDir = function(dir) {
    if (dir === 'left') {
      this.direction = 'left';
      this.vel = -Math.abs(this.vel);
      this.rotatePacFace();
    } else if (dir === 'right') {
      this.direction = 'right';
      this.vel = Math.abs(this.vel);
      this.rotatePacFace();
    } else if (dir === 'up') {
      this.direction = 'up';
      this.vel = -Math.abs(this.vel);
      this.rotatePacFace();
    } else if (dir === 'down') {
      this.direction = 'down';
      this.vel = Math.abs(this.vel);
      this.rotatePacFace();
    } else {
      console.log(' changeDir problems ');
    }
  };

  this.rotatePacFace = function() {
    console.log("rotatePacFace");
    switch ( this.direction )  {
      case 'left':  this.rotateFace = Math.PI;  break;
      case 'right':  this.rotateFace = 0;  break;
      case 'up':  this.rotateFace = Math.PI*3/2;  break;
      case 'down':  this.rotateFace = Math.PI/2;  break;
      case 'stop': console.log("stopped");  break;
      default:
        console.log("rotatePacFace broke");
        break;
    } // end switch
  };

  this.toggleDir = function(dir) { // for bouncing mechanic only
    switch (dir) {
      case 'left':  this.changeDir('right');  break;
      case 'right':  this.changeDir('left');  break;
      case 'up':  this.changeDir('down');  break;
      case 'down':  this.changeDir('up');  break;
      default:
        console.log("toggleDir broke");
        break;
    }
  };

  this.nextMouth = function() {
    if ( (this.mouthSize+this.mouthVel) >= this.maxMouthSize ) {
      // console.log('mouth too BIG');
      this.mouthVel = -Math.abs(this.mouthVel);
    } else if ( (this.mouthSize+this.mouthVel) <= this.minMouthSize ) {
      // console.log('mouth too SMALL');
      this.mouthVel = Math.abs(this.mouthVel);
    } else {
      // nothing
    }
    this.mouthSize += this.mouthVel;
  };

  // move pac in facing direction
  this.movePac = function() {
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      this.x += this.vel;
    } else if ( (this.direction === 'up') || (this.direction === 'down') ) {
      this.y += this.vel;
    } else {
      console.log(' slide problems ');
    }
  }; // slide

  this.draw = function() {
    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)
    // eAngle	The ending angle, in radians
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineW;
    ctx.beginPath();
    ctx.translate(this.x,this.y);
    ctx.rotate(this.rotateFace);
    // ctx.arc(x,y,r,sAngle,eAngle,[counterclockwise]);
    // ctx.arc(0,0, this.radius, (Math.PI/4)*this.mouthSize, -(Math.PI/4)*this.mouthSize );
    ctx.arc(0,0, this.radius, this.mouthSize, -this.mouthSize );
    ctx.lineTo(0,0);
    ctx.closePath();
    ctx.fill();   // fill the arc
    ctx.stroke();  // draw the line
    ctx.rotate(-this.rotateFace);
    ctx.translate(-this.x,-this.y);
  }; // draw

  this.update = function() {
    if (this.moveState === 'go') {
      if (!this.inBounds()) {  // not in bounds so change direction
        console.log("change direction");
        // this.toggleDir(this.direction);
        this.moveState = 'stop';
      } else {  // is in bounds, proceed as normal
        this.movePac();
        this.nextMouth();
      }
    } else if (this.moveState === 'stop') {
      this.xVel = 0;
      this.yVel = 0;
    } else {
      // nothin
    }
  }; // update

} // PAC
