// Traffic Light

let radius = 10;
let centerX = 50;
let topY = 25;
let middleY = 50;
let bottomY = 75;

// Background
rectangle(0, 0, 100, 100, "#333333");

// Traffic light housing
rectangle(30, 10, 40, 80, "#222222");

// Red light (top)
circle(centerX, topY, radius, "#FF0000");

// Yellow light (middle)
circle(centerX, middleY, radius, "#FFFF00");

// Green light (bottom)
circle(centerX, bottomY, radius, "#00FF00");
