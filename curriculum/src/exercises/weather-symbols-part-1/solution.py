def description_to_elements(description):
    if description == "sunny":
        return ["sun"]
    elif description == "dull":
        return ["cloud"]
    elif description == "miserable":
        return ["cloud", "rain"]
    elif description == "hopeful":
        return ["sun", "cloud"]
    elif description == "rainbow-territory":
        return ["sun", "cloud", "rain"]
    elif description == "exciting":
        return ["cloud", "snow"]
    elif description == "snowboarding-time":
        return ["sun", "cloud", "snow"]
