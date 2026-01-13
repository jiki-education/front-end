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
  for (const item of recipe) {
    if (!inList(fridge, item)) {
      list.push(item);
    }
  }
  return list;
}
