let headRadius = 5;
let snowmanX = 50;
let groundY = 80;

let bodyRadius = 0;
let baseRadius = 0;

let baseY = 0;
let bodyY = 0;
let headY = 0;

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white");

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white");

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white");
