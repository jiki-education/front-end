let canvasWidth = 100;
let groundTop = 90;

let flowerCenterX = canvasWidth / 2;
let flowerCenterY = 90;
let flowerRadius = 0;

let pistilRadius = 0;

let stemTop = 0;
let stemHeight = 0;
let stemWidth = 0;
let stemLeft = 0;

let leafTop = 0;
let leafXRadius = 0;
let leafYRadius = 0;

let leftLeafLeft = 0;
let rightLeafLeft = 0;

for (let i = 0; i < 60; i = i + 1) {
  flowerCenterY = flowerCenterY - 1;
  flowerRadius = flowerRadius + 0.4;

  pistilRadius = pistilRadius + 0.1;

  stemTop = flowerCenterY;
  stemHeight = groundTop - flowerCenterY;
  stemWidth = stemHeight / 10;
  stemLeft = flowerCenterX - stemWidth / 2;

  leafTop = stemTop + stemHeight / 2;
  leafXRadius = flowerRadius * 0.5;
  leafYRadius = flowerRadius * 0.2;

  leftLeafLeft = stemLeft - leafXRadius;
  rightLeafLeft = stemLeft + stemWidth + leafXRadius;

  // Sky
  rectangle(0, 0, 100, 90, "#ADD8E6");

  // Ground
  rectangle(0, groundTop, 100, 10, "green");

  // Stem
  rectangle(stemLeft, stemTop, stemWidth, stemHeight, "green");

  // Flower head
  circle(flowerCenterX, flowerCenterY, flowerRadius, "pink");

  // Pistil
  circle(flowerCenterX, flowerCenterY, pistilRadius, "yellow");

  // Leaves
  ellipse(leftLeafLeft, leafTop, leafXRadius, leafYRadius, "green");
  ellipse(rightLeafLeft, leafTop, leafXRadius, leafYRadius, "green");
}
