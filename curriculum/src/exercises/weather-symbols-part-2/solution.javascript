function drawWeather(elements) {
  drawSky();

  let hasCloud = false;
  for (const element of elements) {
    if (element === "cloud") {
      hasCloud = true;
    }
  }

  for (const element of elements) {
    if (element === "sun" && hasCloud) {
      drawSun("small");
    } else if (element === "sun") {
      drawSun("large");
    } else if (element === "cloud") {
      drawCloud();
    } else if (element === "rain") {
      drawRain();
    } else if (element === "snow") {
      drawSnow();
    }
  }
}

function drawSky() {
  rectangle(0, 0, 100, 100, "#ADD8E6");
}

function drawSun(size) {
  if (size === "large") {
    circle(50, 50, 25, "#ffed06");
  } else {
    circle(75, 30, 15, "#ffed06");
  }
}

function drawCloud() {
  rectangle(25, 50, 50, 10, "#FFFFFF");
  circle(25, 50, 10, "#FFFFFF");
  circle(40, 40, 15, "#FFFFFF");
  circle(55, 40, 20, "#FFFFFF");
  circle(75, 50, 10, "#FFFFFF");
}

function drawRain() {
  ellipse(30, 70, 3, 5, "#56AEFF");
  ellipse(50, 70, 3, 5, "#56AEFF");
  ellipse(70, 70, 3, 5, "#56AEFF");
  ellipse(40, 80, 3, 5, "#56AEFF");
  ellipse(60, 80, 3, 5, "#56AEFF");
}

function drawSnow() {
  circle(30, 70, 5, "#56AEFF");
  circle(50, 70, 5, "#56AEFF");
  circle(70, 70, 5, "#56AEFF");
  circle(40, 80, 5, "#56AEFF");
  circle(60, 80, 5, "#56AEFF");
}
