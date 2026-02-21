balance = 10
repeat(20):
    rate = random.randint(0, 10)
    growth = balance * rate / 100
    balance = balance + growth
check_balance(balance)
