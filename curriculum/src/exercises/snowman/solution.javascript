// Build a Snowman!

let snowmanX = 50;
let headY = 27;
let headSize = 5;
let bodyY = 42;
let bodySize = 10;
let baseY = 72;
let baseSize = 20;

// Sky
rectangle(0, 0, 100, 60, "#87CEEB");

// Snowy ground
rectangle(0, 60, 100, 40, "#F0F0F0");

// Base (bottom, biggest)
circle(snowmanX, baseY, baseSize, "white");

// Body (middle)
circle(snowmanX, bodyY, bodySize, "white");

// Head (top, smallest)
circle(snowmanX, headY, headSize, "white");
