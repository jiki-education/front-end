---
title: "Les dictionnaires"
description: "Une page de carnet à spirale où chaque entrée a une clé à gauche et sa valeur à droite, ce qui te donne des données étiquetées plutôt qu'une simple liste."
en_md5: 3b1b01f6a914ffe1ce4a54e023e46bdd
---

Les tableaux sont notre premier choix dès qu'on a une liste de quelque chose : une liste de mentors, une liste de scores, une liste d'ingrédients. Pour n'importe quelle liste, c'est un tableau qu'il te faut.

Mais il existe une autre structure de données (_data structure_ en anglais) très courante elle aussi, pour les cas où on veut quelque chose d'un peu plus complexe qu'une liste.

Imagine qu'on veuille stocker quelques informations sur moi : mon nom, mon âge, mon lieu de naissance. On pourrait utiliser un tableau, mais ce qui se passe n'est pas très clair quand on fait ça.

Est-ce que England est mon lieu de naissance ou l'endroit où je vis ? Est-ce que 42 est mon âge ou autre chose ?

Et si je veux utiliser tout ça, il faut que je me souvienne que la première position est pour le nom, la deuxième pour l'âge, la troisième pour le lieu de naissance. C'est un peu le bazar, et c'est le bazar parce que ce n'est pas vraiment une liste de choses. C'est plus complexe que ça. Et c'est là que les dictionnaires (_dictionaries_ en anglais) entrent en jeu. Un dictionnaire est un nouveau type de structure de données, la cinquième que tu rencontres : tu as les strings, les nombres, les booléens, les tableaux, et maintenant les dictionnaires.

Et je veux que tu imagines un dictionnaire comme une feuille d'un carnet à spirale.

Sur la partie gauche, tu as les intitulés, les mots `"name"`, `"age"`, `"birthplace"`, et on les appelle des clés (_keys_ en anglais).

Et sur la partie droite, à côté de chaque intitulé, tu as les données elles-mêmes, `"Jeremy"`, `42`, `"England"`, et on les appelle des valeurs (_values_ en anglais).

Tout comme un tableau, un dictionnaire est une seule chose. C'est une page d'un carnet. Et tout comme un tableau, Jiki peut le mettre dans une variable, dans une boîte, ou en entrée d'une fonction, ou encore récupérer un dictionnaire sur le tapis roulant. Voici donc à quoi ressemble un dictionnaire en code. On utilise des accolades pour marquer le début et la fin, et à l'intérieur tu as des paires : une clé à gauche, un deux-points, puis la valeur à droite. Et on met une virgule entre chaque paire. Alors Jiki voit ça et sort son carnet à spirale. Il écrit `name`, `"Jeremy"`, `age`, `42`, et ainsi de suite pour chaque paire.

Et quand il a terminé, il détache la feuille et la range dans une boîte étiquetée person.

Il y a quelques règles à connaître. Les clés sont toujours des strings. Elles doivent être entourées de guillemets, et chaque clé doit être unique. Tu ne peux pas avoir deux clés appelées `name` dans le même dictionnaire.

Les valeurs peuvent être identiques si tu veux, mais les clés doivent être différentes.

Et les valeurs peuvent être n'importe quoi : des strings, des nombres, des booléens, des tableaux, ou même d'autres dictionnaires.

Tu peux aussi avoir un dictionnaire vide, tout comme on avait un tableau vide, et on peut partir de là pour le compléter plus tard.

Bon, tu as un dictionnaire, mais comment récupérer quelque chose dedans ?

On utilise la même syntaxe à crochets qu'avec les tableaux et les strings, mais au lieu d'un numéro de position, on met une clé. Donc si on veut récupérer le nom de quelqu'un dans un dictionnaire, on écrit :

```javascript
person["name"] // "Jeremy"
```

Et ça dit à Jiki de regarder dans le dictionnaire `person`, de trouver la clé `"name"`, et d'en sortir la valeur. Jiki va à la boîte person, sort la page du carnet, parcourt toutes les clés jusqu'à trouver `"name"`, puis lit la valeur, `"Jeremy"`, et la met dans une nouvelle boîte appelée name.

Les crochets veulent toujours dire la même chose : tu plonges la main dans quelque chose pour en sortir autre chose. Avec les tableaux et les strings, tu utilises un nombre pour dire à quelle position tu veux prendre quelque chose. Avec les dictionnaires, tu utilises une string pour la clé.

C'est la même idée, juste une syntaxe légèrement différente.
