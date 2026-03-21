---
title: "Stock Market"
description: ""
---

On the first of January this year, you invested a hard-earned $10 into the stock market. You've decided to keep it a secret from your family and only tell them after 20 years when it's (hopefully!) gained lots of value.

There are three things to understand about stock markets:

1. They're unpredictable. They might grow or fall each year. On average they tend to grow about 10% but it can vary dramatically.
2. As they grow, your money grows faster than the stock market due to compound interest. If you invest $10 this year, and the stock market doubles in value over the next 10 years you'll have $20. If it doubles again over the next 10 years, you'll have $40 ($20 _ 2, not $10 _ 2!)
3. As you make profit, you have to tell the taxman about it!

### Exercise Flow

You have a function called `marketGrowth(year)` which returns a number of how much the stock market has grown by this year (e.g. `5` meaning it grew by `5%`). So if you invest $10 and it grows by 5%, you now have $10.50.

Your job is to track how much money you have each year and report it to the taxman using `reportTax(year, balance)`. Then after 20 years, announce to your family the final amount using `announceToFamily(value)`. The first `marketGrowth(...)` year should be this current year.

Check the functions below for more details, and if you get stuck, you can always check the hints!
