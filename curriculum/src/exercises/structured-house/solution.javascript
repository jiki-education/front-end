// Sky variables
let skyColor = "#add8e6";
let skyLeft = 0;
let skyTop = 0;
let skyWidth = 100;
let skyHeight = 20;

// Grass variables
let grassColor = "#3cb372";
let grassLeft = 0;
let grassTop = 80;
let grassWidth = 100;
let grassHeight = 20;

// House Frame variables
let houseColor = "#f0985b";
let houseLeft = 20;
let houseTop = 50;
let houseWidth = 60;
let houseHeight = 40;

// Roof variables
let roofColor = "#8b4513";
let roofOverhang = 4;
let roofLeft = houseLeft - roofOverhang;
let roofRight = houseLeft + houseWidth + roofOverhang;
let roofPeakX = houseLeft + houseWidth / 2;
let roofPeakY = houseTop - 20;
let roofBaseY = houseTop;

// Left window variables
let windowColor = "#FFFFFF";
let window1Left = 30;
let window1Top = 55;
let windowWidth = 12;
let windowHeight = 13;

// Right window variables
let window2Left = 58;
let window2Top = 55;

// Door variables
let doorColor = "#A0512D";
let doorLeft = 43;
let doorTop = 72;
let doorWidth = 14;
let doorHeight = 18;

// Door knob variables
let knobColor = "#FFDF00";
let knobCenterX = 55;
let knobCenterY = 81;
let knobRadius = 1;

// The sky
rectangle(skyLeft, skyTop, skyWidth, skyHeight, skyColor);

// The grass
rectangle(grassLeft, grassTop, grassWidth, grassHeight, grassColor);

// The frame of the house
rectangle(houseLeft, houseTop, houseWidth, houseHeight, houseColor);

// The roof
triangle(roofLeft, roofBaseY, roofPeakX, roofPeakY, roofRight, roofBaseY, roofColor);

// The left window
rectangle(window1Left, window1Top, windowWidth, windowHeight, windowColor);

// The second window
rectangle(window2Left, window2Top, windowWidth, windowHeight, windowColor);

// The door
rectangle(doorLeft, doorTop, doorWidth, doorHeight, doorColor);

// The door knob
circle(knobCenterX, knobCenterY, knobRadius, knobColor);
