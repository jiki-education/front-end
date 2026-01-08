// Light blue background
fillColorHex("#ADD8E6");
rectangle(0, 0, 100, 100);

// Ground
fillColorHex("#ffffff"); // Ice ground
rectangle(0, 70, 100, 30); // Ice ground

// Penguin wings
fillColorHex("#000000"); // Black
ellipse(28, 55, 10, 25); // Left wing
ellipse(72, 55, 10, 25); // Right wing

// Penguin body
fillColorHex("#000000"); // Black for the body
ellipse(50, 53, 25, 40); // Outer body (oval shape)
fillColorHex("#ffffff"); // White for the belly
ellipse(50, 50, 21, 39); // Inner belly (oval shape)

// Penguin head
fillColorHex("#000000"); // Black
circle(50, 31, 23); // Head (circle)
fillColorHex("#ffffff"); // White for the face
ellipse(41, 32, 11, 14); // Left part of the face
ellipse(59, 32, 11, 14); // Right part of the face
ellipse(50, 40, 16, 11); // Lower part of the face

// Penguin eyes
fillColorHex("#000000"); // Black
circle(42, 33, 3); // Left eye
fillColorHex("#ffffff"); // White
circle(43, 34, 1); // Left iris

fillColorHex("#000000"); // Black
circle(58, 33, 3); // Right eye
fillColorHex("#ffffff"); // White
circle(57, 34, 1); // Right iris

// Feet
fillColorHex("#FFA500");
ellipse(40, 93, 7, 4);
ellipse(60, 93, 7, 4);
triangle(46, 38, 54, 38, 50, 47);
