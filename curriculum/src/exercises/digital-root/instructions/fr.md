---
title: "Racine numérique"
description: "Réduis un nombre à un seul chiffre en additionnant ses chiffres à répétition."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

La racine numérique (_digital root_ en anglais) d'un nombre est ce qu'on obtient quand on additionne ses chiffres encore et encore, jusqu'à ce qu'il ne reste plus qu'un seul chiffre.

Si la première addition des chiffres te laisse encore un nombre à plusieurs chiffres, tu additionnes à nouveau les chiffres de _ce_ résultat, et ainsi de suite jusqu'à ce qu'il ne reste plus qu'un seul chiffre.

Par exemple, pour trouver la racine numérique de `942` :

```
9 + 4 + 2 = 15
1 + 5 = 6
```

La racine numérique de `942` est donc `6`.

Un nombre qui ne compte déjà qu'un seul chiffre (comme `7`) est sa propre racine numérique.

Crée une fonction appelée `digitalRoot` qui prend un nombre et renvoie sa racine numérique.

### La fonction `String()`

Au cours des dernières leçons, tu as eu accès à la fonction `Number(str)`, qui convertit une string en nombre.

Tu peux faire la même chose dans l'autre sens, et transformer un nombre en string grâce à la fonction `String(num)`. Par exemple :

```js
String(147) === "147"
```

Là encore, remarque la majuscule au début du nom, et là encore, ne te préoccupe pas du pourquoi pour l'instant !

### Mets en pratique ce que tu as appris.

Il existe bien des façons de résoudre cet exercice, mais la solution attendue ici passe par l'utilisation d'une boucle `while`.

Amuse-toi bien !
