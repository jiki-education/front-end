def hamming_distance(str1, str2):
    counter = 0
    distance = 0
    for letter in str1:
        if letter != str2[counter]:
            distance = distance + 1
        counter = counter + 1
    return distance
