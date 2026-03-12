let snowmanCx = 50;
let headCy = 20;
let headRadius = 10;
let bodyCy = 40;
let bodyRadius = 15;
let baseCy = 70;
let baseRadius = 20;

// Base (bottom, biggest)
circle(snowmanCx, baseCy, baseRadius, "white");

// Body (middle)
circle(snowmanCx, bodyCy, bodyRadius, "white");

// Head (top, smallest)
circle(snowmanCx, headCy, headRadius, "white");
