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
  this.mouthVel = getRadianAngle(6);
  this.direction = direction;
  this.rotateFace = 0;
  this.moveState = moveState;
  this.color = Colors.pacYellow;
  this.lineW = 2;
  this.pixX = 0;
  this.pixY = 0;

  this.init = function() {
    this.rotatePacFace();
  }; // init

  this.togglePacGo = function() {
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

  this.inBounds = function(tDir) {
    var bounds;
    if ( (tDir === 'left') && (this.x - Math.abs(this.vel) - this.radius < 0) ) {
      bounds = false;
    } else if ( (tDir === 'right') && (this.x + this.vel + this.radius >= CANVAS.width) ) {
      bounds = false;
    } else if ( (tDir === 'up') && (this.y - Math.abs(this.vel) - this.radius < 0) ) {
      bounds = false;
    } else if ( (tDir === 'down') && (this.y + this.vel + this.radius >= CANVAS.height) ) {
      bounds = false;
    // } else if ( (this.pixTest(tDir).data[0] < 10) && (this.pixTest(tDir).data[2] > 200) ) {
    //   bounds = false;
    } else {
      bounds = true;
    }
    return bounds;
  }; // inBounds

  this.changeDir = function(newDir) {
    if ( this.inBounds(newDir) ) { // don't allow pac to turn or go if not in bounds
          if (newDir === 'left') {
            this.direction = 'left';
            this.vel = -Math.abs(this.vel);
            this.rotatePacFace();
          } else if (newDir === 'right') {
            this.direction = 'right';
            this.vel = Math.abs(this.vel);
            this.rotatePacFace();
          } else if (newDir === 'up') {
            this.direction = 'up';
            this.vel = -Math.abs(this.vel);
            this.rotatePacFace();
          } else if (newDir === 'down') {
            this.direction = 'down';
            this.vel = Math.abs(this.vel);
            this.rotatePacFace();
          } else {
            console.log(' changeDir problems ');
          }
          myGame.myPac.moveState = 'go';
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

  this.nextMouth = function() {
    if ( (this.mouthSize+this.mouthVel) >= this.maxMouthSize ) {
      this.mouthVel = -Math.abs(this.mouthVel);
    } else if ( (this.mouthSize+this.mouthVel) <= this.minMouthSize ) {
      this.mouthVel = Math.abs(this.mouthVel);
    } else {
      // nothing
    }
    this.mouthSize += this.mouthVel;
  };

  this.pixTest = function(sDir) {
    var xCoef = 0;
    var yCoef = 0;
    if ( sDir === 'left' ) {
      xCoef = -1;
    } else if (sDir === 'right') {
      xCoef = 1;
    } else if (sDir === 'up') {
      yCoef = -1;
    } else if (sDir === 'down') {
      yCoef = 1;
    } else {
      console.log('pixTestFront issues');
    }
    this.pixX = (this.x+((this.lineW+this.radius+1)*xCoef));
    this.pixY = (this.y+((this.lineW+this.radius+1)*yCoef));
    let pxData =  ctx.getImageData(this.pixX, this.pixY, 1, 1).data;
    let pxRgba = 'rgba('+pxData[0]+','+pxData[1]+','+pxData[2]+','+pxData[3]+')';
    return { data: pxData,
             rgbastr: pxRgba };
  };

  this.drawPixTestBox = function() {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.rect(this.pixX-4,this.pixY-4,8,8);
    ctx.stroke();
    $('.pixel-window').css( 'background-color', this.pixTest(this.direction).rgbastr );
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
    if (myGame.pxBoxOn) this.drawPixTestBox();
  }; // draw

  this.update = function() {
    if (this.moveState === 'go') {
      if (!this.inBounds(this.direction)) {  // not in bounds so change direction
        console.log('collision!');
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
