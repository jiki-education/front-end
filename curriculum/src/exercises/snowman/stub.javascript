// Build a Snowman!
// Set the variables so the snowman matches the image

let snowmanX = 0;
let headY = 0;
let headSize = 0;
let bodyY = 0;
let bodySize = 0;
let baseY = 0;
let baseSize = 0;

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
