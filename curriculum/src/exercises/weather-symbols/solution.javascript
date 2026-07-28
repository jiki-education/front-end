function drawForecast(days) {
  let weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  for (let i = 0; i < days.length; i++) {
    let elements = descriptionToElements(days[i])
    draw(i, weekdays[i], elements)
  }
}

function descriptionToElements(description) {
  if (description === "Sunny ☀️") {
    return ["sun"]
  } else if (description === "Dull 😴") {
    return ["cloud"]
  } else if (description === "Miserable 😩") {
    return ["cloud", "rain"]
  } else if (description === "Hopeful 🤞") {
    return ["sun", "cloud"]
  } else if (description === "Rainbow territory! 🌈") {
    return ["sun", "cloud", "rain"]
  } else if (description === "Exciting 🤩") {
    return ["cloud", "snow"]
  } else if (description === "Snowboarding time! 🏂") {
    return ["sun", "cloud", "snow"]
  }
}
