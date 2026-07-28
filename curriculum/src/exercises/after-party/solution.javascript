function isPerson(person, name) {
  return name === person || name.startsWith(person + " ")
}

function plusOnesFor(names, plusOnes, person) {
  for (let i = 0; i < names.length; i++) {
    if (isPerson(person, names[i])) {
      return plusOnes[i]
    }
  }
  return "Not on the list!"
}
