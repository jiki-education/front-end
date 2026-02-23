function signPrice(signText) {
  let numLetters = 0;
  for (const letter of signText) {
    if (letter !== " ") {
      numLetters = numLetters + 1;
    }
  }
  let price = numLetters * 12;
  return `That will cost $${price}`;
}