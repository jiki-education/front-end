let money = 10
let year = 2026
repeat(20) {
  money = money * (100 + marketGrowth(year)) / 100
  reportTax(year, money)
  year = year + 1
}
announceToFamily(money)
