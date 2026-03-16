let skyColor = hsl(210, 70, 60);
let sunColor = rgb(255, 237, 0);

// Draw a slightly different version of the scene below
// 100 times - flipbook style!

// The sky
rectangle(0, 0, 100, 100, skyColor);

// The Sun
circle(50, 10, 5, sunColor);

// The sea
rectangle(0, 85, 100, 5, "#0308ce");

// The sand
rectangle(0, 90, 100, 10, "#C2B280");
