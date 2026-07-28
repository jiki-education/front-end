function tableFor(names, tables, guest) {
  const surname = guest.split(" ").slice(1).join(" ")
  for (let i = 0; i < names.length; i++) {
    if (names[i].endsWith(" " + surname)) {
      return tables[i]
    }
  }
  return "No table found"
}
