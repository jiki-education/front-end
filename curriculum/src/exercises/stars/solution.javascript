function stars(count) {
  let result = [];
  let star = "";
  for (let i = 0; i < count; i++) {
    star = star + "*";
    result.push(star);
  }
  return result;
}