function descriptionToElements(description) {
  if (description === "sunny") {
    return ["sun"];
  } else if (description === "dull") {
    return ["cloud"];
  } else if (description === "miserable") {
    return ["cloud", "rain"];
  } else if (description === "hopeful") {
    return ["sun", "cloud"];
  } else if (description === "rainbow-territory") {
    return ["sun", "cloud", "rain"];
  } else if (description === "exciting") {
    return ["cloud", "snow"];
  } else if (description === "snowboarding-time") {
    return ["sun", "cloud", "snow"];
  }
}
