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
rectangle(skyLeft, skyTop, skyWidth, skyHeight, skyColor);

// The grass
rectangle(0, 80, 100, 100, "#3cb372");

// The frame of the house
rectangle(houseLeft, 50, 60, 40, "#f0985b");

// The roof
triangle(roofLeft, 50, 50, 30, 84, 50, "#8b4513");

// The left window
rectangle(30, 55, 12, 13, "#FFFFFF");

// The second window
rectangle(58, 55, 12, 13, "#FFFFFF");

// The door
rectangle(43, 72, 14, 18, "#A0512D");

// The door knob
circle(55, 81, 1, "#FFDF00");
