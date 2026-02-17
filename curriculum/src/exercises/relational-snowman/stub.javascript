// Snowman (Arithmetic)
// Rewrite the snowman so all the sizes are based on one variable.
// The circles should touch each other and stack from top to bottom.
// When you change size, the whole snowman should scale!

// These are fixed
let size = 5;
let snowmanX = 50;
let headY = 20;

// Derive these from the variables above
let headRadius = 0;
let bodyRadius = 0;
let baseRadius = 0;

let bodyY = 0;
let baseY = 0;

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
