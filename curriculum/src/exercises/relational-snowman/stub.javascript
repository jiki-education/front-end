let snowmanX = 50;
let size = 4;

let headRadius = 0;
let bodyRadius = 0;
let baseRadius = 0;

let baseY = 0;
let bodyY = 0;
let headY = 0;

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white");

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white");

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white");
