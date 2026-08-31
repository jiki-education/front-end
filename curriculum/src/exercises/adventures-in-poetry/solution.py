poem = ""
words = 0
needs_space = False

while True:
    found = move()

    if found == "🏁":
        break
    if found == "" or is_emoji(found):
        continue
    if found == "'":
        poem = poem + "'"
        needs_space = False
        continue
    if found == ",":
        poem = poem + ","
        needs_space = True
        continue
    if needs_space:
        poem = poem + " "
    poem = poem + found
    needs_space = True
    words = words + 1
    if words == 7:
        break

recite(poem)
