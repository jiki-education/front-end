// Relational Traffic Lights
// Change the radius and watch the traffic light resize!

let red = "red";
let yellow = "amber";
let green = "green";
let housingColor = "charcoal";

let radius = 10;
let centerX = radius * 5;
let redY = radius * 3;
let yellowY = radius * 5;
let greenY = radius * 7;
let housingX = radius * 3;
let housingY = radius;
let housingWidth = radius * 4;
let housingHeight = radius * 8;

// Traffic light housing
rectangle(housingX, housingY, housingWidth, housingHeight, housingColor);

// Red light (top)
circle(centerX, redY, radius, red);

// Yellow light (middle)
circle(centerX, yellowY, radius, yellow);

// Green light (bottom)
circle(centerX, greenY, radius, green);
