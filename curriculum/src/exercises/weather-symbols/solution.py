def draw_forecast(days):
    weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    for i in range(len(days)):
        elements = description_to_elements(days[i])
        draw(i, weekdays[i], elements)

def description_to_elements(description):
    if description == "Sunny ☀️":
        return ["sun"]
    elif description == "Dull 😴":
        return ["cloud"]
    elif description == "Miserable 😩":
        return ["cloud", "rain"]
    elif description == "Hopeful 🤞":
        return ["sun", "cloud"]
    elif description == "Rainbow territory! 🌈":
        return ["sun", "cloud", "rain"]
    elif description == "Exciting 🤩":
        return ["cloud", "snow"]
    elif description == "Snowboarding time! 🏂":
        return ["sun", "cloud", "snow"]
