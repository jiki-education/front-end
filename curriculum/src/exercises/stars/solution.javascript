function stars(count) {
  let result = [];
  let star = "";
  repeat(count) {
    star = star + "*";
    result.push(star);
  }
  return result;
}