function hammingDistance(str1, str2) {
  let counter = 0;
  let distance = 0;
  for (const letter of str1) {
    if (letter !== str2[counter]) {
      distance = distance + 1;
    }
    counter = counter + 1;
  }
  return distance;
}
