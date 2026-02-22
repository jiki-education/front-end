// Snowman (Arithmetic)

// These are fixed
let headRadius = 5;
let snowmanX = 50;
let groundY = 80;

// Derive these from the variables above
let bodyRadius = headRadius * 2;
let baseRadius = headRadius * 3;

let baseY = groundY - baseRadius;
let bodyY = baseY - baseRadius - bodyRadius;
let headY = bodyY - bodyRadius - headRadius;

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white");

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white");

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white");
