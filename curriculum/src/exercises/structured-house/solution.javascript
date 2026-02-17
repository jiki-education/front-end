// Colors
let skyColor = "#add8e6";
let grassColor = "#3cb372";
let houseColor = "#f0985b";
let roofColor = "#8b4513";
let windowColor = "#FFFFFF";
let doorColor = "#A0512D";
let knobColor = "#FFDF00";

// House frame
let houseLeft = 20;
let houseTop = 50;
let houseWidth = 60;
let houseHeight = 40;

// Roof
let roofOverhang = 4;
let roofHeight = 20;
let roofLeft = houseLeft - roofOverhang;
let roofRight = houseLeft + houseWidth + roofOverhang;
let roofPeakX = houseLeft + houseWidth / 2;
let roofPeakY = houseTop - roofHeight;
let roofBaseY = houseTop;

// Windows
let windowWidth = 12;
let windowHeight = 13;
let windowInset = 10;
let windowTop = houseTop + 5;
let window1Left = houseLeft + windowInset;
let window2Left = houseLeft + houseWidth - windowInset - windowWidth;

// Door
let doorWidth = 14;
let doorHeight = 18;
let doorLeft = houseLeft + (houseWidth - doorWidth) / 2;
let doorTop = houseTop + houseHeight - doorHeight;

// Door knob
let knobRadius = 1;
let knobX = doorLeft + doorWidth - knobRadius - 1;
let knobY = doorTop + doorHeight / 2;

// Grass
let grassHeight = 20;
let grassTop = 100 - grassHeight;

// The sky
rectangle(0, 0, 100, 100, skyColor);

// The grass
rectangle(0, grassTop, 100, grassHeight, grassColor);

// The frame of the house
rectangle(houseLeft, houseTop, houseWidth, houseHeight, houseColor);

// The roof
triangle(roofLeft, roofBaseY, roofPeakX, roofPeakY, roofRight, roofBaseY, roofColor);

// The left window
rectangle(window1Left, windowTop, windowWidth, windowHeight, windowColor);

// The right window
rectangle(window2Left, windowTop, windowWidth, windowHeight, windowColor);

// The door
rectangle(doorLeft, doorTop, doorWidth, doorHeight, doorColor);

// The door knob
circle(knobX, knobY, knobRadius, knobColor);
