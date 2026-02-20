function inList(items, target) {
  for (const item of items) {
    if (item === target) {
      return true;
    }
  }
  return false;
}

function shoppingList(fridge, recipe) {
  let list = [];
  for (const ingredient of recipe) {
    if (!inList(fridge, ingredient)) {
      list.push(ingredient);
    }
  }
  return list;
}
