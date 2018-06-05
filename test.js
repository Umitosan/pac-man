

/**
* Fractal_Vortex timesTableApp constructor
*
*/
function Fractal_Vortex () {

/**
 Constants
**/

/* Controls Variables */

this.presetsOptions = null;
this.currentPreset = null;

this.radius = 0;
this.radiusMin = 0;
this.radiusMax = 0;
this.radiusIncrement = 0;

this.base = 0;
this.baseMin = 0;
this.baseMax = 0;

this.animateBase = false;
this.baseSpeed = 0;
this.baseSpeedMin = 0;
this.baseSpeedMax = 0;
this.baseSpeedIncrement = 0;

this.multiplyFactor = 0;
this.multiplyFactorMin = 0;
this.multiplyFactorMax = 0;

this.animateMultiplyFactor = false;
this.multiplyFactorSpeed = 0;
this.multiplyFactorSpeedMin = 0;
this.multiplyFactorSpeedMax = 0;
this.multiplyFactorSpeedIncrement = 0;

this.drawCircle = false;
this.drawPoints = false;

// UI Variables
this.presetSelect = null;

this.radiusInputField = null;
this.radiusSlider = null;

this.baseInputField = null;
this.baseSlider = null;

this.baseSpeedInputField = null;
this.baseSpeedSlider = null;

this.multiplyFactorInputField = null;
this.multiplyFactorSlider = null;

this.multiplyFactorSpeedInputField = null;
this.multiplyFactorSpeedSlider = null;

this.checkDrawCircle = null;
this.checkDrawPoints = null;

// Container components
this.controlsContainer = null;
this.animationContainer = null;

this.window = null;

/* View Variables */
this.locationX = 0;
this.locationY = 0;
this.textDisplayLocationX = 0;
this.textDisplayLocationY = 0;
this.creditsLocationX = 0;
this.creditsLocationY = 0;

this.labelFontSize = 0;

this.initialTimeStart = 0;

this.colorRgbMap = {};

// Calculated values
this.circumference = 0;
this.pointCircleCenter = 0;
this.pointCircleStart = 0;

this.contentGroup = null;
this.detailsGroup = null;

this.initialized = false;

}

/**
* Fractal_Vortex timesTableApp class
*
*/
Fractal_Vortex.prototype = {

constructor: Fractal_Vortex,

initControls: function() {
 this.initControlsValues();
 this.initControlsContainer();
 this.initControlsUI();
},
initView: function() {
 this.initViewValues();
 this.initViewAnimation();

 this.updateUIValues()
},
initControlsValues: function() {

this.window = $(window);

this.radius = this.formatDecimal(this.window.height()/(3/2), this.radiusIncrement);
this.radiusMin = 0;
this.radiusMax = this.radius * 3;
this.radiusIncrement = 1;

this.baseMin = 0;
this.baseMax = 500;

this.baseSpeedIncrement = 0.01;
this.baseSpeedMin = 0;
this.baseSpeedMax = 1;

this.multiplyFactorMin = 0;
this.multiplyFactorMax = 500;

this.multiplyFactorSpeedIncrement = 0.001;
this.multiplyFactorSpeedMin = 0;
this.multiplyFactorSpeedMax = 0.1;

// Load Preset
this.presetsOptions = this.generatePresets();

// Initialize time
this.initialTimeStart = Date.now();
},
generatePresets: function() {
 var presetsObject = {
   "Default": {
     base: 20,
     baseSpeed: 0,
     multiplyFactor: 0,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: true
     },
 "Spiral": {
     base: 451.7,
     baseSpeed: 0,
     multiplyFactor: 302,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Honeycomb": {
     base: 451.7,
     baseSpeed: 0,
     multiplyFactor: 300,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Spokes 1": {
     base: 100,
     baseSpeed: 0,
     multiplyFactor: 51,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: true
     },
 "Spokes 2": {
     base: 200,
     baseSpeed: 0,
     multiplyFactor: 351,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Spokes 3": {
     base: 300,
     baseSpeed: 0,
     multiplyFactor: 91,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Spokes 4": {
     base: 500,
     baseSpeed: 0,
     multiplyFactor: 160.091,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Void": {
     base: 200,
     baseSpeed: 0,
     multiplyFactor: 67.667,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Energy Fields": {
     base: 400,
     baseSpeed: 0.1,
     multiplyFactor: 0,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: false
     },
 "Growing Heart": {
     base: 0,
     baseSpeed: 0.1,
     multiplyFactor: 2,
     multiplyFactorSpeed: 0,
     drawCircle: true,
     drawPoints: true
     },
 "Cell Growth": {
     base: 100,
     baseSpeed: 0,
     multiplyFactor: 0,
     multiplyFactorSpeed: .01,
     drawCircle: true,
     drawPoints: false
     },
 "Lotus 1": {
     base: 500,
     baseSpeed: 0,
     multiplyFactor: 335,
     multiplyFactorSpeed: .01,
     drawCircle: true,
     drawPoints: false
     },
 "Lotus 2": {
     base: 500,
     baseSpeed: 0,
     multiplyFactor: 201.4,
     multiplyFactorSpeed: .01,
     drawCircle: true,
     drawPoints: false
     },
 "Sunflower": {
     base: 500,
     baseSpeed: 0,
     multiplyFactor: 25,
     multiplyFactorSpeed: .01,
     drawCircle: true,
     drawPoints: false
     },
 "Warp Speed": {
     base: 200,
     baseSpeed: 0,
     multiplyFactor: 50,
     multiplyFactorSpeed: .05,
     drawCircle: true,
     drawPoints: false
     },
 "Bubbles": {
     base: 500,
     baseSpeed: 0,
     multiplyFactor: 163,
     multiplyFactorSpeed: .001,
     drawCircle: true,
     drawPoints: false
     }
 };
 return presetsObject;
},
loadPreset: function(presetsOptions, presetName) {

var preset = presetsOptions[presetName];

this.base = preset.base;
this.baseSpeed = preset.baseSpeed;
this.multiplyFactor = preset.multiplyFactor;
this.multiplyFactorSpeed = preset.multiplyFactorSpeed;
this.drawCircle = preset.drawCircle;
this.drawPoints = preset.drawPoints;

this.updateAnimateBase();
this.updateAnimateMultiplyFactor();
},
initControlsContainer: function() {
// UI Components
this.presetSelect = $("#presetSelect");

this.radiusInputField = $("#radiusInputField");
this.radiusSlider = $("#radiusSlider");

this.baseInputField = $("#baseInputField");
this.baseSlider = $("#baseSlider");

this.baseSpeedInputField = $("#baseSpeedInputField");
this.baseSpeedSlider = $("#baseSpeedSlider");

this.multiplyFactorInputField = $("#multiplyFactorInputField");
this.multiplyFactorSlider = $("#multiplyFactorSlider");

this.multiplyFactorSpeedInputField = $("#multiplyFactorSpeedInputField");
this.multiplyFactorSpeedSlider = $("#multiplyFactorSpeedSlider");

this.checkDrawCircle = $("#checkDrawCircle");
this.checkDrawPoints = $("#checkDrawPoints");

// Container components
this.controlsContainer = $("#controls");
this.animationContainer = $("#animation");

},
initControlsUI: function() {
var timesTableApp = this;

/* Select Preset */
this.presetSelect.selectmenu({
   change: function( event, data ) {
 timesTableApp.currentPreset = data.item.value;
 timesTableApp.loadPreset(timesTableApp.presetsOptions, timesTableApp.currentPreset);
 timesTableApp.updateUIValues();
   }
  });
// Select first preset
this.currentPreset = Object.keys(this.presetsOptions)[0];
this.loadPreset(this.presetsOptions, this.currentPreset);

/* Control Radius */
this.radiusInputField.attr('min', this.radiusMin);
this.radiusInputField.attr('max', this.radiusMax);
this.radiusInputField.attr('step', this.radiusIncrement);
this.radiusInputField.change(function () {
 var value = timesTableApp.formatDecimal(this.value, timesTableApp.radiusIncrement);
 timesTableApp.radius = value;
 timesTableApp.updateUIValues();
});
// Slider to control radius
this.radiusSlider.slider({
 range: "min",
 min: this.radiusMin,
 max: this.radiusMax,
 value: this.radius,
 step: this.radiusIncrement,
 slide: function( event, ui ) {
   timesTableApp.radius = timesTableApp.formatDecimal(ui.value, timesTableApp.radiusIncrement);
   timesTableApp.updateUIValues();
 }
});

/* Control Base */
this.baseInputField.attr('min', this.baseMin);
this.baseInputField.attr('max', this.baseMax);
this.baseInputField.attr('step', this.baseSpeedIncrement);
this.baseInputField.change(function () {
 var value = timesTableApp.formatDecimal(this.value, timesTableApp.baseSpeedIncrement);
 timesTableApp.base = value;
 timesTableApp.updateUIValues();
});
// Slider to control base/number of points
this.baseSlider.slider({
 range: "min",
 min: this.baseMin,
 max: this.baseMax,
 value: this.base,
 step: this.baseSpeedIncrement,
 slide: function( event, ui ) {
   timesTableApp.base = timesTableApp.formatDecimal(ui.value, timesTableApp.baseSpeedIncrement);
   timesTableApp.updateUIValues();
 }
});

/* Control Base Speed */
this.baseSpeedInputField.attr('min', this.baseSpeedMin);
this.baseSpeedInputField.attr('max', this.baseSpeedMax);
this.baseSpeedInputField.attr('step', this.baseSpeedIncrement);
this.baseSpeedInputField.change(function () {
 var value = timesTableApp.formatDecimal(this.value, timesTableApp.baseSpeedIncrement);
 timesTableApp.baseSpeed = value;
 timesTableApp.updateAnimateBase();
 timesTableApp.updateUIValues();
});
// Slider to control multiply factor animation speed
this.baseSpeedSlider.slider({
 range: "min",
 min: this.baseSpeedMin,
 max: this.baseSpeedMax,
 value: this.baseSpeed,
 step: this.baseSpeedIncrement,
 slide: function( event, ui ) {
   timesTableApp.baseSpeed = timesTableApp.formatDecimal(ui.value, timesTableApp.baseSpeedIncrement);
 timesTableApp.updateAnimateBase()
 timesTableApp.updateUIValues();
 }
});

/* Control Multiply Factor */
this.multiplyFactorInputField.attr('min', this.multiplyFactorMin);
this.multiplyFactorInputField.attr('max', this.multiplyFactorMax);
this.multiplyFactorInputField.attr('step', this.multiplyFactorSpeedIncrement);
this.multiplyFactorInputField.change(function () {
 var value = timesTableApp.formatDecimal(this.value, timesTableApp.multiplyFactorSpeedIncrement);
 timesTableApp.multiplyFactor = value;
 timesTableApp.updateUIValues();
});
// Slider to control multiply factor
this.multiplyFactorSlider.slider({
 range: "min",
 min: this.multiplyFactorMin,
 max: this.multiplyFactorMax,
 value: this.multiplyFactor,
 step: this.multiplyFactorSpeedIncrement,
 slide: function( event, ui ) {
   timesTableApp.multiplyFactor = timesTableApp.formatDecimal(ui.value, timesTableApp.multiplyFactorSpeedIncrement);
   timesTableApp.updateUIValues();
 }
});

/* Control Multiply Factor Speed */
this.multiplyFactorSpeedInputField.attr('min', this.multiplyFactorSpeedMin);
this.multiplyFactorSpeedInputField.attr('max', this.multiplyFactorSpeedMax);
this.multiplyFactorSpeedInputField.attr('step', this.multiplyFactorSpeedIncrement);
this.multiplyFactorSpeedInputField.change(function () {
 var value = timesTableApp.formatDecimal(this.value, timesTableApp.multiplyFactorSpeedIncrement);
 timesTableApp.multiplyFactorSpeed = value;
 timesTableApp.updateAnimateMultiplyFactor();
 timesTableApp.updateUIValues();
});
// Slider to control multiply factor animation speed
this.multiplyFactorSpeedSlider.slider({
 range: "min",
 min: this.multiplyFactorSpeedMin,
 max: this.multiplyFactorSpeedMax,
 value: this.multiplyFactorSpeed,
 step: this.multiplyFactorSpeedIncrement,
 slide: function( event, ui ) {
   timesTableApp.multiplyFactorSpeed = timesTableApp.formatDecimal(ui.value, timesTableApp.multiplyFactorSpeedIncrement);

 timesTableApp.updateAnimateMultiplyFactor();
 timesTableApp.updateUIValues();
 }
});

// Toggle button to control drawing the circle
this.checkDrawCircle.button();
this.checkDrawCircle.click( function() {
 timesTableApp.drawCircle = !timesTableApp.drawCircle;
});

// Toggle button to control drawing the circle
this.checkDrawPoints.button();
this.checkDrawPoints.click( function() {
 timesTableApp.drawPoints = !timesTableApp.drawPoints;
});
},
initViewValues: function() {
this.resize();

this.locationX = view.size.width / 2;
this.locationY = view.size.height / 2;

this.radius = this.formatDecimal(Math.min(this.locationX, this.locationY) - Math.min(this.locationX, this.locationY)/10, this.radiusIncrement);

this.textDisplayLocationX = this.locationX * 5/2;
this.textDisplayLocationY = this.locationY * 1/4;
this.creditsLocationX = this.locationX * 5/2;
this.creditsLocationY = this.locationY * 5/3;

this.labelFontSize = this.getLabelFontSize();

// Calculated values
this.circumference = 2 * Math.PI * this.radius;
this.pointCircleCenter = new Point(this.locationX, this.locationY);
this.pointCircleStart = new Point(this.locationX-this.radius, this.locationY);
},
initViewAnimation: function() {
 view.draw();
},
updateUIRadius: function() {
 /* Radius */
 this.radiusInputField.val(this.radius);
 this.radiusSlider.slider("value", this.radius);
},
updateUIBase: function() {
 /* Base */
 this.baseInputField.val(this.base);
 this.baseSlider.slider("value", this.base);
//	this.baseSlider.slider(this.animateBase ? "disable" : "enable");
},
updateUIBaseSpeed: function() {
 /* Base Speed */
 this.baseSpeedInputField.val(this.baseSpeed);
 this.baseSpeedSlider.slider("value", this.baseSpeed);
},
updateUIMultiplyFactor: function() {
 /* Multiply Factor */
 this.multiplyFactorInputField.val(this.multiplyFactor);
 this.multiplyFactorSlider.slider("value", this.multiplyFactor);
},
updateUIMultiplyFactorSpeed: function() {
 /* Multiply Factor Speed */
 this.multiplyFactorSpeedInputField.val(this.multiplyFactorSpeed);
 this.multiplyFactorSpeedSlider.slider("value", this.multiplyFactorSpeed);
},
updateUICircle: function() {
this.checkDrawCircle.attr('checked', (this.drawCircle ? true : false ));
this.checkDrawCircle.button('refresh');
},
updateUIPoints: function() {
this.checkDrawPoints.attr('checked', (this.drawPoints ? true : false ));
this.checkDrawPoints.button('refresh');
},
updateUIValues: function() {
 // Update UI values of the slider controls
 this.updateUIRadius();
 this.updateUIBase();
 this.updateUIBaseSpeed();
 this.updateUIMultiplyFactor();
 this.updateUIMultiplyFactorSpeed();
 this.updateUICircle();
 this.updateUIPoints();
},
updateAnimateBase: function() {
 if((!this.animateBase && this.baseSpeed > 0)
 || (this.animateBase && this.baseSpeed == 0)) {
   this.animateBase = !this.animateBase;
 }
},
updateAnimateMultiplyFactor: function() {
 if((!this.animateMultiplyFactor && this.multiplyFactorSpeed > 0)
 || (this.animateMultiplyFactor && this.multiplyFactorSpeed == 0)) {
   this.animateMultiplyFactor = !this.animateMultiplyFactor;
 }
},
getAngle: function (distance, base) {
 return (2 * Math.PI / (base)) * distance;
},
getCartesianCoordinates: function (angle, radius) {
 return [Math.cos(angle)*radius, Math.sin(angle)*radius];
},
getLabelFontSize() {
 return Math.min(15, 5 + this.baseMax/(2 * this.base));
},
formatDecimal: function(value, sample) {
 valueParsed = Number(value);
 sampleParsed = Number(sample);
 var decimalPortion = sampleParsed.toString().split(".")[1];
 var decimalPlaces = 0;
 if(decimalPortion) {
   decimalPlaces = decimalPortion.length;
 }
 var base = Math.pow(10, decimalPlaces)
 return Number((Math.round(valueParsed*base)/base).toFixed(decimalPlaces));
},
/**
* Gets the rgb value array for the given recursion level. Calculates or retrieves the cached value.
**/
getRgb: function(level) {
 if(this.colorRgbMap[level] == null) {
   // Keep hue value in range [0, 1]
   var hue = (level / 10) % 1;
   var rgb = this.hslToRgb(hue, 0.5, 0.5);
   this.colorRgbMap[level] = rgb;
 }
 return this.colorRgbMap[level];
},

/**
* Converts an HSL color value to RGB. Conversion formula
* adapted from http://en.wikipedia.org/wiki/HSL_color_space.
* Assumes h, s, and l are contained in the set [0, 1] and
* returns r, g, and b in the set [0, 255].
*
* @param   {number}  h       The hue
* @param   {number}  s       The saturation
* @param   {number}  l       The lightness
* @return  {Array}           The RGB representation
*/
hslToRgb: function(h, s, l){
 var r, g, b;

 if(s == 0){
   r = g = b = l; // achromatic
 }else{
   var hue2rgb = function hue2rgb(p, q, t){
     if(t < 0) t += 1;
     if(t > 1) t -= 1;
     if(t < 1/6) return p + (q - p) * 6 * t;
     if(t < 1/2) return q;
     if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
     return p;
   }

   var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
   var p = 2 * l - q;
   r = hue2rgb(p, q, h + 1/3);
   g = hue2rgb(p, q, h);
   b = hue2rgb(p, q, h - 1/3);
 }

 return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
},
drawLine: function(point0, point1) {
 var segment = new Path();
 segment.strokeWidth = 1;
 segment.add(point0);
 segment.add(point1);
 var rgb = this.getRgb(this.multiplyFactor);
 segment.strokeColor = new Color(rgb[0]/255, rgb[1]/255, rgb[2]/255);
 return segment;
},
drawContent: function() {
 var itemGroup = new Group();

 // Increment base if animation active
 if(this.animateBase) {

   this.base = this.formatDecimal(this.base + this.baseSpeed, this.baseSpeed)
   timesTableApp.updateUIBase();
   if(this.base >= this.baseMax) {
     this.base = this.baseMin;
   }
 }
 // Increment multiplyFactor if animation active
 if(this.animateMultiplyFactor) {

   this.multiplyFactor = this.formatDecimal(this.multiplyFactor + this.multiplyFactorSpeed, this.multiplyFactorSpeed)
   timesTableApp.updateUIMultiplyFactor();
   if(this.multiplyFactor >= this.multiplyFactorMax) {
     this.multiplyFactor = this.multiplyFactorMin;
   }
 }

 var rgb = this.getRgb(this.multiplyFactor);
 strokeColor = new Color(rgb[0]/255, rgb[1]/255, rgb[2]/255);

 // Draw circle
 if(this.drawCircle) {
   var circle = new Path.Circle(this.pointCircleCenter, this.radius);
   circle.strokeColor = strokeColor;
   itemGroup.addChild(circle);
 }

 this.labelFontSize = this.getLabelFontSize();
 for(i = 0; i < this.base; i++) {
   var angle0 = this.getAngle(i, this.base)
   var p0 = new Point(this.getCartesianCoordinates(angle0, this.radius));
   p0 = new Point(p0.x + this.pointCircleCenter.x, p0.y + this.pointCircleCenter.y);

   if(this.drawPoints) {
     // Draw dots at points
     var path = new Path.Circle(p0, 1);
     path.strokeColor = strokeColor;
     itemGroup.addChild(path);

     var textPosX = (p0.x < this.locationX) ? p0.x - this.labelFontSize : p0.x + this.labelFontSize;
     var textPosY = (p0.y < this.locationY) ? p0.y - this.labelFontSize : p0.y + this.labelFontSize;

     pointLabel = new PointText({
       point: new Point(textPosX, textPosY),
       justification: 'center',
       fontSize: this.labelFontSize,
       fillColor: 'brown'
     });
     pointLabel.content = i;
     itemGroup.addChild(pointLabel);
   }

   /**
     p1
   **/
   var angle1 = this.getAngle(i * this.multiplyFactor, this.base)
   var p1 = new Point(this.getCartesianCoordinates(angle1, this.radius));
   p1 = new Point(p1.x + this.pointCircleCenter.x, p1.y + this.pointCircleCenter.y);

   // Draw line
   var line = this.drawLine(p0, p1);
   itemGroup.addChild(line);
 }
 return itemGroup;
},
update: function() {
//Redraw vortex image and detail text display
this.contentGroup = this.redraw(this.contentGroup, this.drawContent());
},


redraw: function(drawGroup, drawFunction) {
// Remove group and redraw
if(drawGroup) {
 drawGroup.remove();
}
return drawFunction;
},
resize: function() {

var height = Math.min(this.window.height(), this.controlsContainer.height())
var offset = this.animationContainer.offset().top;
this.animationContainer.height(height);

},
start: function() {
 view.onFrame = function (event) {
 timesTableApp.update();
 }

view.onResize = function (event) {
 timesTableApp.initView();
}
}

};

var timesTableApp;

$(function() {
// Setup Paper.JS
paper.install(window);
timesTableApp = new Fractal_Vortex();

// Initialize timesTableApplication
timesTableApp.initControls();
timesTableApp.resize();
paper.setup('canvas-fractal-vortex');
timesTableApp.initView();
timesTableApp.start();
});

$(window).resize(function() {
timesTableApp.initView();
});
