def table_for(names, tables, guest):
    surname = " ".join(guest.split(" ")[1:])
    for i in range(len(names)):
        if names[i].endswith(" " + surname):
            return tables[i]
    return "No table found"
