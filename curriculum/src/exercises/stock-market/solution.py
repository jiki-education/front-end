money = 10
year = 2026
repeat(20):
    money = money * (100 + market_growth(year)) / 100
    report_tax(year, money)
    year = year + 1
announce_to_family(money)
