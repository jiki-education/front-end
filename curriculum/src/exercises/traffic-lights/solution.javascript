// Traffic Light

let radius = 10;
let centerX = 50;
let topY = 25;
let middleY = 50;
let bottomY = 75;

// Background
rectangle(0, 0, 100, 100, "charcoal");

// Traffic light housing
rectangle(30, 10, 40, 80, "charcoal");

// Red light (top)
circle(centerX, topY, radius, "red");

// Yellow light (middle)
circle(centerX, middleY, radius, "amber");

// Green light (bottom)
circle(centerX, bottomY, radius, "green");
