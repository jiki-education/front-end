// Step 1: Define your fact variables
let canvasSize = 100;
let gap = 10;
let radius = 15;
let color = "yellow";

// Step 2: Define calculated variables
let sunX = canvasSize - gap - radius;
let sunY = gap + radius;

// Step 3: Draw the circle
circle(sunX, sunY, radius, color);
