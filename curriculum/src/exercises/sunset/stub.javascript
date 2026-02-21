// TODO: Set variables here
// let sunCy = ...
// let sunRadius = ...

repeat(100) {
  // TODO: Update the variables here.

  // The sky
  rectangle(0, 0, 100, 100, hsl(210, 70, 60));

  // The Sun
  circle(50, 10, 5, rgb(255, 237, 0));

  // The sea
  rectangle(0, 85, 100, 5, "#0308ce");

  // The sand
  rectangle(0, 90, 100, 10, "#C2B280");
}
