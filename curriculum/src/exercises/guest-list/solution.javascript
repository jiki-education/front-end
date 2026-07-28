function numChancersInQueue(queue, guestList) {
  let count = 0

  for (const person of queue) {
    if (!guestList.includes(person)) {
      count = count + 1
    }
  }

  return count
}
