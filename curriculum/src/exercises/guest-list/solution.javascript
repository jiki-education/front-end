function onGuestList(list, person) {
  for (const name of list) {
    if (name === person) {
      return true;
    }
  }

  return false;
}
