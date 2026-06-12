let red = "red";
let yellow = "amber";
let green = "green";
let housingColor = "charcoal";
let radius = 10;

let centerX = 0; // radius * ???
let redY = 0; // radius * ???
let yellowY = 0; // radius * ???
let greenY = 0; // radius * ???
let housingX = 0; // radius * ???
let housingY = 0; // radius * ???
let housingWidth = 0; // radius * ???
let housingHeight = 0; // radius * ???

rectangle(housingX, housingY, housingWidth, housingHeight, housingColor);

circle(centerX, redY, radius, red);

circle(centerX, yellowY, radius, yellow);

circle(centerX, greenY, radius, green);
