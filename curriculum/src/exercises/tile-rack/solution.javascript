function findTile(rack, letter) {
  let position = 0;
  for (const tile of rack) {
    if (tile === letter) {
      return position;
    }
    position = position + 1;
  }
  return -1;
}