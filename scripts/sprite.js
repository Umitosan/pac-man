function Sprite(x,y,frameTotal,frame0,curFrame,duration) {
  this.destX = x;
  this.destY = y;
  this.frameTotal = frameTotal;
  this.frame0 = frame0;
  this.curFrame = curFrame;
  this.frameDuration = duration;
  this.timeCount = 0;

  this.draw = function() {
    // console.log('drawing frame ', this.curFrame);
    // simple draw image:     drawImage(image, x, y)
    // draw slice of image:   drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    this.ctx.drawImage( /*image*/   this.spriteSheet,
                        /* sx */    (this.spriteWidth*this.curFrame), // read sprite shit right to left like this:  (this.spriteWidth*this.frameTotal-this.spriteWidth) - (this.spriteWidth*this.curFrame)
                        /* sy */    0,
                        /*sWidth*/  this.spriteWidth,
                        /*sHeight*/ this.spriteHeight,
                        /* dx */    this.destX,
                        /* dy */    this.destY,
                        /*dWidth*/  this.displayWidth,
                        /*dHidth*/  this.displayHeight );
  }; // draw
}
