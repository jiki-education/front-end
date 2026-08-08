---
title: "Les dictionnaires"
description: "Une page de carnet à spirale où chaque entrée a une clé à gauche et sa valeur à droite, ce qui te donne des données étiquetées plutôt qu'une simple liste."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Les tableaux sont notre premier réflexe dès qu'on a une liste de quelque chose : une liste de mentors, une liste de scores, une liste d'ingrédients. Peu importe la liste, c'est un tableau qu'il te faudra.

Mais il existe une autre structure de données (_data structure_ en anglais) très courante elle aussi, pour les cas où on veut quelque chose d'un peu plus complexe qu'une liste.

Imagine qu'on veuille stocker quelques informations sur moi : mon nom, mon âge, mon lieu de naissance. On pourrait utiliser un tableau, mais ce qui se passe n'est plus très clair quand on fait ça.

Est-ce que England est mon lieu de naissance ou l'endroit où je vis ? Est-ce que 42 est mon âge ou autre chose ?

Et si je veux pouvoir utiliser tout ça, il faut que je me souvienne que la première position est pour le nom, la deuxième pour l'âge, la troisième pour le lieu de naissance. C'est un peu le bazar car ce n'est pas vraiment une liste de choses. C'est plus complexe que ça. Et c'est là que les dictionnaires (_dictionaries_ en anglais) entrent en jeu. Un dictionnaire est un nouveau type de structure de données. C'est le cinquième que tu découvres : tu as les strings, les nombres, les booléens, les tableaux, et maintenant les dictionnaires.

Et je veux que tu imagines un dictionnaire comme une feuille d'un carnet à spirale.

Du côté gauche, tu as les intitulés, les mots `"name"`, `"age"`, `"birthplace"` : on les appelle des « clés » (_keys_ en anglais).

Et du côté droit, à côté de chaque intitulé, tu as les données en elles-mêmes : `"Jeremy"`, `42`, `"England"` et on les appelle des « valeurs » (_values_ en anglais).

Tout comme pour les tableaux, un dictionnaire est une seule entité. C'est la page d'un carnet. Et comme pour les tableaux, Jiki peut la mettre dans une variable, dans une boîte, ou comme entrée pour une fonction, ou bien encore récupérer un dictionnaire sur le tapis roulant. Voici donc à quoi ressemble un dictionnaire en code : on utilise des accolades pour marquer le début et la fin, et à l'intérieur, tu as des paires : une clé à gauche, deux-points, puis la valeur à droite. Et il y a une virgule entre chaque paire. Alors Jiki voit ça et sort son carnet à spirale. Il écrit `name`, `"Jeremy"`, `age`, `42`, et ainsi de suite pour chaque paire.

Et quand il a fini, il détache la feuille et la range dans une boîte étiquetée `person`.

Il y a quelques règles à connaître. Les clés sont toujours des strings. Elles doivent absolument être entourées de guillemets, et chaque clé doit obligatoirement être unique. Tu ne peux pas avoir deux clés appelées `name` dans le même dictionnaire.

Si tu veux, tes valeurs peuvent être identiques, mais les clés, elles, doivent être différentes.

Et les valeurs peuvent être n'importe quoi : des strings, des nombres, des booléens, des tableaux, ou même d'autres dictionnaires.

Tu peux aussi avoir un dictionnaire vide, tout comme on avait un tableau vide, qu'on pourra compléter plus tard.

Bien, maintenant que tu as un dictionnaire, comment en récupérer quelque chose ?

On utilise la même syntaxe à crochets qu'avec les tableaux et les strings, mais au lieu d'indiquer un numéro de position, on utilise une clé. Donc si on veut récupérer le nom de quelqu'un dans un dictionnaire, on écrit :

```javascript
person["name"] // "Jeremy"
```

Et ça indique à Jiki d'aller regarder dans le dictionnaire `person`, de trouver la clé `"name"`, et d'en récupérer sa valeur. Jiki va donc à la boîte `person`, sort la page du carnet et parcourt alors toutes les clés jusqu'à ce qu'il trouve `"name"`. Puis, il lit la valeur `"Jeremy"` et la met dans une nouvelle boîte appelée `name`.

Les crochets veulent toujours dire la même chose : tu plonges la main dans quelque chose pour récupérer autre chose. Avec les tableaux et les strings, tu utilises un nombre pour indiquer à quelle position tu veux prendre quelque chose. Avec les dictionnaires, tu utilises une string pour la clé.

C'est le même principe, juste une syntaxe légèrement différente.
