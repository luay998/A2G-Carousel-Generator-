'use strict';
var slides         = [];
var activeSlideIdx = 0;
var AC             = '#7CFF7C';
var BG             = '#060c08';
var logoUrl        = null;
var bgDataUrl      = null;
var activeBgPreset = 0;
var slideCounter   = 0;
var elCounter      = 0;
var selEl          = null;
var selElId        = null;
var mode           = 'edit';
var showGrid       = false;
var snapEnabled    = true;
var FONTS          = ['Poppins','Inter','Montserrat','Oswald','Raleway','Bebas Neue','Roboto','Playfair Display'];
var CANVAS_SIZE    = 540;

function newElId()   { return 'el_' + (++elCounter); }
function getActive() { return slides[activeSlideIdx] || null; }
