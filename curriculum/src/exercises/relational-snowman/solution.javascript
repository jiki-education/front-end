// Snowman (Arithmetic)

// These are fixed
let size = 5;
let snowmanX = 50;
let headY = 20;

// Derive these from the variables above
let headRadius = size * 2;
let bodyRadius = size * 3;
let baseRadius = size * 4;

let bodyY = headY + headRadius + bodyRadius;
let baseY = bodyY + bodyRadius + baseRadius;

// Sky
rectangle(0, 0, 100, 60, "#87CEEB");

// Snowy ground
rectangle(0, 60, 100, 40, "#F0F0F0");

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white");

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white");

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white");
