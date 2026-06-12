// Relational Traffic Lights
// Change the radius and watch the traffic light resize!

let red = "red";
let yellow = "amber";
let green = "green";
let housingColor = "charcoal";

let center = 50;
let radius = 10;

let yellowY = center;
let redY = center - radius * 2;
let greenY = center + radius * 2;
let housingX = center - radius * 2;
let housingY = center - radius * 4;
let housingWidth = radius * 4;
let housingHeight = radius * 8;

// Traffic light housing
rectangle(housingX, housingY, housingWidth, housingHeight, housingColor);

// Red light (top)
circle(center, redY, radius, red);

// Yellow light (middle)
circle(center, yellowY, radius, yellow);

// Green light (bottom)
circle(center, greenY, radius, green);
