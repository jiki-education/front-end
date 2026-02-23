function packALunch(sandwich, drink, snack) {
  let lunchbox = [];
  lunchbox.push(sandwich);
  if (drink !== "milkshake") {
    lunchbox.push(drink);
  }
  lunchbox.push(snack);
  return lunchbox;
}