let balance = 10
repeat(20) {
  let rate = Math.randomInt(0, 10)
  let growth = balance * rate / 100
  balance = balance + growth
}
checkBalance(balance)
