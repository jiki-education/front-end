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
  rectangle(0, 0, 100, 100, hslToHex(skyH, skyS, skyL));

  // The Sun
  sunGreen = sunGreen - 1;
  sunCy = sunCy + 1;
  sunRadius = sunRadius + 0.2;
  circle(50, sunCy, sunRadius, rgbToHex(sunRed, sunGreen, sunBlue));

  // The sea
  rectangle(0, 85, 100, 5, "#0308ce");

  // The sand
  rectangle(0, 90, 100, 10, "#C2B280");
}
