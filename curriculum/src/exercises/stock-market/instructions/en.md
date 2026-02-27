---
title: "Stock Market"
description: ""
---

You've just invested $10 in the stock market! Each year, the market randomly grows your money by between 0% and 10%.

Here's the key: the growth each year is based on your **current** balance, not your original $10. So as your money grows, the growth itself gets bigger too.

To work out each year's growth:

1. Pick a random rate from 0 to 10 using `Math.randomInt(0, 10)`
2. Work out the growth amount: take your current balance, multiply it by the rate, then divide by 100
3. Add that growth to your balance

For example, if your balance is $11 and the rate is 5, the growth would be 11 times 5 divided by 100 = $0.55, making your new balance $11.55.

Do this for 20 years, then call `checkBalance()` with your final amount.
