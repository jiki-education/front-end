let sunRadius = 5;
let sunCy = 10;

let sunRed = 255;
let sunGreen = 237;
let sunBlue = 0;

let skyH = 210;
let skyS = 70;
let skyL = 60;

for (let i = 0; i < 100; i++) {
  // The sky
  skyH = skyH + 0.4;
  fillColorHsl(skyH, skyS, skyL);
  rectangle(0, 0, 100, 100);

  // The Sun
  sunGreen = sunGreen - 1;
  sunCy = sunCy + 1;
  sunRadius = sunRadius + 0.2;
  fillColorRgb(sunRed, sunGreen, sunBlue);
  circle(50, sunCy, sunRadius);

  // The sea
  fillColorHex("#0308ce");
  rectangle(0, 85, 100, 5);

  // The sand
  fillColorHex("#C2B280");
  rectangle(0, 90, 100, 10);
}
