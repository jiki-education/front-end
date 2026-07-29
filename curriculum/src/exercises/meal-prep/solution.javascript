function shoppingList(fridge, recipe) {
  let list = []
  for (const ingredient of recipe) {
    if (!fridge.includes(ingredient)) {
      list.push(ingredient)
    }
  }
  return list
}
