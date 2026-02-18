def sign_price(sign_text):
    num_letters = 0
    for letter in sign_text:
        if letter != " ":
            num_letters = num_letters + 1
    price = num_letters * 12
    return "That will cost $" + str(price)