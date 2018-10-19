/* jshint esversion: 6 */


function Sound(src,vol,loopit=false) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.volume = vol;
    this.sound.loop = loopit;
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function(){
      this.sound.play();
    };

    this.stop = function(){
      this.sound.pause();
    };

    this.changeVol = function(newVol) {
      this.sound.volume = newVol;
    };

}
