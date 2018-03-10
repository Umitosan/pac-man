/*jshint esversion: 6 */

function Pac(x,y,velocity,diameter,direction,moveState)  {
  this.x = x;
  this.y = y;
  this.vel = velocity;
  this.diameter = diameter;
  this.radius = diameter/2;
  this.mouthSize = getRadianAngle(70);
  this.maxMouthSize = getRadianAngle(70);
  this.minMouthSize = getRadianAngle(2);
  this.mouthVel = getRadianAngle(8);
  this.direction = direction;
  this.rotateFace = 0;
  this.moveState = moveState;
  this.color = Colors.pacYellow;
  this.lineW = 2;
  this.pixX = 0;
  this.pixY = 0;

  this.init = function() {
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
    var bounds = 'none';
    var sp = State.gridSpacing;
    var off = 10;

    if ( (tDir === 'left') && ( this.getNearestIntersection(this.x-sp+off,this.y).char === "#") )  {
      // console.log("LEFT bounds hit ", this.getNearestIntersection(this.x-sp+off,this.y) );
      bounds = false;
    } else if ( (tDir === 'right') && ( this.getNearestIntersection(this.x+sp-off,this.y).char === "#") ) {
      // console.log("RIGHT bounds hit ", this.getNearestIntersection(this.x+sp-off,this.y) );
      bounds = false;
    } else if ( (tDir === 'up') && ( this.getNearestIntersection(this.x,this.y-sp+off).char === "#") ) {
      // console.log("UP bounds hit ", this.getNearestIntersection(this.x,this.y-sp+off) );
      bounds = false;
    } else if ( (tDir === 'down') && (( this.getNearestIntersection(this.x,this.y+sp-off).char === "#") || ( this.getNearestIntersection(this.x,this.y+sp-off).char === "W")) ) {
      // console.log("DOWN bounds hit ", this.getNearestIntersection(this.x,this.y+sp-off) );
      bounds = false;
    } else {
      bounds = true;
    }

    return bounds;
  }; // inBounds

  this.atGridIntersection = function() {
    var atInter = false;
    var xDis = ( (this.x) % State.gridSpacing );
    var yDis = ( (this.y) % State.gridSpacing );
    if ( (xDis <= 3) && (yDis <= 3) ) {
      atInter = true;
    }
    // console.log("at interseciton ");
    return atInter;
  };

  this.getNearestIntersection = function(someX, someY) {
    let sp = State.gridSpacing;

    let foundRow = 'none';
    let foundCol = 'none';
    let foundChar = 'none';

    foundRow = Math.round(someY/sp)-1; // -1 to offset the fact that arrays count starting at 0
    foundCol = Math.round(someX/sp)-1;

    foundChar = myGame.myLevel.currentLevel[ foundRow ][ foundCol ];

    return { char: foundChar,
              row: foundRow,
              col: foundCol };
  };

  this.changeDir = function(newDir) {
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
    this.moveState = 'go';
  };

  this.rotatePacFace = function() {
    // console.log("rotatePacFace");
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

  this.hopToIn = function() {
    let data = this.getNearestIntersection(this.x,this.y);
    this.x = (data.col+1)*State.gridSpacing;
    this.y = (data.row+1)*State.gridSpacing;
    console.log('pac x,y = '+ this.x +","+this.y );
  };

  this.tryEatPill = function() {
    let data = this.getNearestIntersection(this.x,this.y);
    let r = data.row;
    let c = data.col;
    if ( (data.char === 0) || (data.char === 'B') ) {
      myGame.updateScore(data.char);
      myGame.myLevel.currentLevel[r][c] = '-';
    }
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
    this.pixX = (this.x+((this.lineW+this.radius+2)*xCoef));
    this.pixY = (this.y+((this.lineW+this.radius+2)*yCoef));
    let pxData =  ctx.getImageData(this.pixX, this.pixY, 1, 1).data;
    let pxRgba = 'rgba('+pxData[0]+','+pxData[1]+','+pxData[2]+','+pxData[3]+')';
    return { data: pxData,
             rgbastr: pxRgba };
  };

  this.drawPixTestBox = function() {
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.rect(this.pixX-5,this.pixY-5,10,10);
    ctx.stroke();
    $('.pixel-window').css( 'background-color', this.pixTest(this.direction).rgbastr );
  };

  this.movePac = function() {
    let gap = 10;
    if ( (this.direction === 'left') || (this.direction === 'right') ) {
      if ((this.x+this.vel) > (CANVAS.width-gap)) {  // handle the teleport at edges
        this.x = gap*2;
      } else if ((this.x+this.vel) < gap) {
        this.x = CANVAS.width-(gap*2);
      } else {
        this.x += this.vel;
      }
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
        if (State.lastDirKey === 'none') {
            // console.log('else if 1');
            if (this.inBounds(this.direction) === false) {
              console.log('collision!');
              this.moveState = 'stop';
              State.lastDirKey = 'none';
              this.hopToIn();
            } else {
              this.tryEatPill();
              this.movePac();
              this.nextMouth();
            }
        } else if (State.lastDirKey !== 'none') {
          // console.log('else if 2');
          if ( this.atGridIntersection() && (this.inBounds(State.lastDirKey) === true) ) {
            this.hopToIn();
            this.changeDir(State.lastDirKey);
            State.lastDirKey = 'none';
          } else if ( this.atGridIntersection() && (this.inBounds(this.direction) === false) ) {
            console.log('collision!');
            this.moveState = 'stop';
            State.lastDirKey = 'none';
            this.hopToIn();
          } else {
            this.tryEatPill();
            this.movePac();
            this.nextMouth();
          }
        } else {
          console.log("[lastDirKey problems]");
        }
    } else if (this.moveState === 'stop') {
      if (State.lastDirKey !== 'none') {
        // console.log('else if 3');
        if (this.inBounds(State.lastDirKey) === true) {
          this.moveState = "go";
          this.changeDir(State.lastDirKey);
          State.lastDirKey = 'none';
          this.tryEatPill();
          this.movePac();
          this.nextMouth();
        }
        // else { // change direction failed so reset key, but DO rotate pacman if in
        //   this.direction = State.lastDirKey;
        //   this.rotatePacFace();
        //   State.lastDirKey = 'none';
        // }
      } else {
        // sit idle
      }
    } else {
      console.log("[move state problems]");
    }
  }; // update

} // PAC
