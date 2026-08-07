---
title: "Jet de dés D&D"
description: "Lance des dés et frappe un gobelin dans une aventure D&D."
en_md5: 627f6cce99fe83ecae4e1b53051201b9
---

Tu crées un bot capable de jouer à Donjons et Dragons (DnD). Si tu ne connais pas DnD, le principe de base est le suivant : on rencontre toutes sortes de situations et on lance des dés pour déterminer ce qui se passe. Il existe plein de dés différents avec un nombre de faces variable (il n'y a pas que le dé à six faces auquel tu es sûrement habitué !)

L'une des situations que tu dois gérer est la rencontre avec un gobelin. Pour attaquer le gobelin, tu dois :

- Générer un **score d'attaque** en lançant un dé à 20 faces.
- Générer un **score de dégâts de base** en lançant un dé à 12 faces.
- Générer un **score de dégâts bonus** en lançant un dé à 10 faces.
- Additionner les dégâts de base et les dégâts bonus pour obtenir tes **dégâts totaux**.
- Frapper le gobelin avec ton jet d'attaque et tes dégâts totaux.

Après chaque jet de dé, tu dois annoncer le nombre obtenu aux autres personnes avec qui tu joues. Si tu essaies de frapper sans annoncer les nombres, elles pourraient croire que tu triches !

Tu as trois fonctions à ta disposition :

- `roll(sides)` (lancer un dé à `sides` faces) lance un dé avec le nombre de faces indiqué. Cette fonction renvoie (_returns_ en anglais) le résultat.
- `announce(value)` (annoncer une valeur) annonce un jet de dé.
- `strike(attack, damage)` (frapper avec l'attaque et les dégâts) frappe le gobelin avec ton jet d'attaque et tes dégâts totaux.

**Important :** à chaque fois que tu appelles `roll()`, Jiki lance un dé et obtient un nombre différent. Ne t'attends pas à obtenir le même nombre chaque fois que tu lances le même dé.
