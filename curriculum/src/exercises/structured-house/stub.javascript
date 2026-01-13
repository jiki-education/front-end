// Sky variables
let skyColor = "#add8e6";
let skyLeft = 0;
let skyTop = 0;
let skyWidth = 100;
let skyHeight = 100;

// House Frame variables
let houseLeft = 20;

// Roof variables
let roofOverhang = 4;
let roofLeft = houseLeft - roofOverhang;

// The sky
fillColorHex(skyColor);
rectangle(skyLeft, skyTop, skyWidth, skyHeight);

// The grass
fillColorHex("#3cb372");
rectangle(0, 80, 100, 100);

// The frame of the house
fillColorHex("#f0985b");
rectangle(houseLeft, 50, 60, 40);

// The roof
fillColorHex("#8b4513");
triangle(roofLeft, 50, 50, 30, 84, 50);

// The left window
fillColorHex("#FFFFFF");
rectangle(30, 55, 12, 13);

// The second window
fillColorHex("#FFFFFF");
rectangle(58, 55, 12, 13);

// The door
fillColorHex("#A0512D");
rectangle(43, 72, 14, 18);

// The door knob
fillColorHex("#FFDF00");
circle(55, 81, 1);
