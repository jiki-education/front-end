---
title: "Faire demi-tour"
description: "Crée une fonction pour faire demi-tour dans le labyrinthe."
en_md5: bbb03498f3b5ec9956af463e85fde414
---

Dans l'exercice précédent, tu as trouvé comment faire sortir le personnage du labyrinthe automatiquement. Beau travail !

L'un des points agréables de cette solution, c'est que le code se lit très naturellement, dans la mesure où il suit de près l'algorithme. À un détail près...

N'as-tu pas trouvé quelque peu frustrant de devoir utiliser `turnLeft()` (tourner à gauche) deux fois pour faire demi-tour, plutôt que d'avoir une fonction `turnAround()` (faire demi-tour) ?

Eh bien, voici l'occasion d'arranger ça !

Crée donc une nouvelle fonction appelée `turnAround` en haut de ton code. Elle ne prend aucune entrée et ne renvoie rien : elle doit simplement appeler `turnLeft()` deux fois.

Utilise ensuite cette fonction dans la solution, dans l'instruction `else` finale.

Essaie de faire en sorte que l'ensemble de ton programme final tienne en 17 lignes de code.
