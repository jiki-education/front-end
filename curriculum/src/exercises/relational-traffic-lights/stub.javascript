// Relational Traffic Lights
// You're back with the traffic lights!
// This time, change the radius and watch the traffic light resize!

// These are set for you
let red = "#FF0000";
let yellow = "#FFFF00";
let green = "#00FF00";
let housingColor = "#222222";
let radius = 10;

// Fix these so they are all relative to the radius
let centerX = 0;
let redY = 0;
let yellowY = 0;
let greenY = 0;
let housingX = 0;
let housingY = 0;
let housingWidth = 0;
let housingHeight = 0;

// Traffic light housing
rectangle(housingX, housingY, housingWidth, housingHeight, housingColor);

// Red light (top)
circle(centerX, redY, radius, red);

// Yellow light (middle)
circle(centerX, yellowY, radius, yellow);

// Green light (bottom)
circle(centerX, greenY, radius, green);
