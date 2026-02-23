// Build a Snowman!

let snowmanX = 50;
let headY = 33;
let headRadius = 10;
let bodyY = 50;
let bodyRadius = 15;
let baseY = 72;
let baseRadius = 20;

// Sky
rectangle(0, 0, 100, 60, "skyblue");

// Snowy ground
rectangle(0, 60, 100, 40, "grey");

// Base (bottom, biggest)
circle(snowmanX, baseY, baseRadius, "white");

// Body (middle)
circle(snowmanX, bodyY, bodyRadius, "white");

// Head (top, smallest)
circle(snowmanX, headY, headRadius, "white");
