// These are fixed
let canvasSize = 100;
let gap = 10;
let sunRadius = 15;
let skyColor = "lightblue";
let sunColor = "yellow";

// Derive these from the variables above
let sunX = canvasSize - gap - sunRadius;
let sunY = gap + sunRadius;

// Sky
rectangle(0, 0, canvasSize, canvasSize, skyColor);

// Sun
circle(sunX, sunY, sunRadius, sunColor);
