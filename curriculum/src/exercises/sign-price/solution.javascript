function signPrice(signText) {
  let price = 0
  for (const letter of signText) {
    if (letter !== " ") {
      price = price + 12
    }
  }
  return `That will cost $${price}`
}
