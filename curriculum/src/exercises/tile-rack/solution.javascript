function findTile(rack, letter) {
  let position = 0;
  for (const tile of rack) {
    if (tile === letter) {
      return "Move to position " + String(position);
    }
    position = position + 1;
  }
  return "Error: Tile not on rack";
}