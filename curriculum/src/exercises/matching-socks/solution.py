def length(s):
    counter = 0
    for char in s:
        counter = counter + 1
    return counter


def starts_with(s, substr):
    if length(s) < length(substr):
        return False

    counter = 0
    for char in substr:
        if s[counter] != char:
            return False
        counter = counter + 1

    return True


def ends_with(word, substr):
    word_length = length(word)
    substr_length = length(substr)
    if substr_length > word_length:
        return False

    counter = word_length - substr_length
    for letter in substr:
        if letter != word[counter]:
            return False
        counter = counter + 1

    return True


def strip_prefix(description, num_letters):
    res = ""
    counter = num_letters
    for i in range(length(description) - num_letters):
        res = res + description[counter]
        counter = counter + 1
    return res


def remove_left_right(description):
    if starts_with(description, "left "):
        return strip_prefix(description, 5)
    else:
        return strip_prefix(description, 6)


def switch_left_right(description):
    if starts_with(description, "left "):
        return "right " + remove_left_right(description)
    elif starts_with(description, "right "):
        return "left " + remove_left_right(description)
    return description


def extract_socks(lst):
    socks = []
    for item in lst:
        if ends_with(item, " sock"):
            socks.append(item)
    return socks


def push_if_missing(lst, element):
    for item in lst:
        if item == element:
            return lst
    lst.append(element)
    return lst


def matching_socks(clean, dirty):
    clean_socks = extract_socks(clean)
    dirty_socks = extract_socks(dirty)
    socks = clean_socks + dirty_socks
    matching_socks_list = []

    other_sock = ""
    for sock1 in socks:
        other_sock = switch_left_right(sock1)

        for sock2 in socks:
            if other_sock == sock2:
                matching_socks_list = push_if_missing(matching_socks_list, remove_left_right(other_sock) + "s")

    return matching_socks_list
