// Sky
fillColorHex("#ADD8E6");
rectangle(0, 0, 100, 100);

// Ground
fillColorHex("#ffffff");
rectangle(0, 70, 100, 30);

// Left Wing
fillColorHex("#000000");
ellipse(28, 55, 10, 25);

//
// TODO: Add the Right wing
//

// Body
fillColorHex("#000000");
ellipse(50, 53, 25, 40);
fillColorHex("#ffffff");
ellipse(50, 50, 21, 39);

// Head
fillColorHex("#000000");
circle(50, 31, 23);

// Left side of face
fillColorHex("#ffffff");
ellipse(41, 32, 11, 14);

//
// TODO: Add the right part of the face
//

// Lower part of face
ellipse(50, 40, 16, 11); // Lower part of the face

// Left eye
fillColorHex("#000000");
circle(42, 33, 3);
fillColorHex("#ffffff");
circle(43, 34, 1);

//
// TODO: Add the right eye
//

// Nose
fillColorHex("#FFA500");
triangle(46, 38, 50, 38, 50, 47); // TODO: Change the nose to be symmetrical.

// Left Foot
fillColorHex("#FFA500");
ellipse(40, 93, 7, 4);

//
// TODO: Add the right foot
//
