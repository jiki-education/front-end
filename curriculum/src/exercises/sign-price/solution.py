def sign_price(sign_text):
    price = 0
    for letter in sign_text:
        if letter != " ":
            price = price + 12
    return "That will cost $" + str(price)
