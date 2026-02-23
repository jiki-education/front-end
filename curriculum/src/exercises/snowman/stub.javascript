// Build a Snowman!
// Set the variables so the snowman matches the image

let snowmanX = 0;
let headY = 0;
let headRadius = 0;
let bodyY = 0;
let bodyRadius = 0;
let baseY = 0;
let baseRadius = 0;

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
