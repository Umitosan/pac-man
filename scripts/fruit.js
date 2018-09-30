/* jshint esversion: 6 */


function FruitGroup() {
  this.dx = undefined;
  this.dy = undefined;
  this.img = undefined;
  this.showFruit = false;

  this.init = function(someSrc) {
    let spacing = State.gridSpacing;
    let someImg = new Image();
    someImg.src = someSrc;
    this.img = someImg;
    this.dx = (spacing*13)+(spacing/2);
    this.dy = (spacing*17)+2;
  };

  this.draw = function() {
    let ctx = State.ctx;
    let spacing = State.gridSpacing;
    if (this.showFruit === true) {
        // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        // void ctx.drawImage(image, dx, dy, dWidth, dHeight);
        ctx.drawImage(  /*image*/   this.img,
                        /* dx */    this.dx,
                        /* dy */    this.dy,
                        /*dWidth*/  spacing*2-6,
                        /*dHidth*/  spacing*2-6
        );
    } // end if
  };

  this.update = function() {

  };

}


// 🍒 Cherry: 100 points.
// 🍓 Strawberry: 300 points
// 🍊 Orange: 500 points
// 🍎 Apple: 700 points
// 🍈 Melon: 1000 points
// PM Galaxian Galaxian Boss: 2000 points
// 🔔 Bell: 3000 points
// 🔑 Key: 5000 points
