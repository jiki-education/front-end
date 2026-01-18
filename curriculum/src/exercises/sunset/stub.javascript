// TODO: Set variables here
// let sunCy = ...
// let sunRadius = ...

for (let i = 0; i < 100; i++) {
  // TODO: Update the variables here.

  // The sky
  fillColorHsl(210, 70, 60);
  rectangle(0, 0, 100, 100);

  // The Sun
  fillColorRgb(255, 237, 0);
  circle(50, 10, 5);

  // The sea
  fillColorHex("#0308ce");
  rectangle(0, 85, 100, 5);

  // The sand
  fillColorHex("#C2B280");
  rectangle(0, 90, 100, 10);
}
