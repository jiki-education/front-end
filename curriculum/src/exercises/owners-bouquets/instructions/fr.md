---
title: "Les bouquets du propriétaire"
description: "Plante des fleurs selon différentes dispositions du jardin."
en_md5: bdb2a772a6549db0226a6c17326f20c6
---

Bienvenue dans ton deuxième exercice avec des scénarios.

On retrouve notre machine de jardinage automatique. Jusqu'ici, on plantait toujours 9 fleurs, mais les choses changent : notre robot doit maintenant pouvoir planter le nombre de fleurs que lui demande le propriétaire de la maison.

Pour cela, on dispose d'une fonction appelée `askNumberOfFlowers()` (demander le nombre de fleurs). Quand on l'utilise, elle demande au propriétaire de la maison combien de fleurs planter, et elle renvoie un nombre avec la réponse. Si la fonction renvoie 3, on doit planter 3 fleurs. Si elle renvoie 8, on doit en planter 8.

On a pour consigne stricte de garder le jardin bien net : il faut donc répartir les fleurs uniformément dans le jardin. S'il y a 3 fleurs, on doit les planter aux positions 25, 50 et 75. S'il y en a 4, aux positions 20, 40, 60 et 80, etc. (Comme d'habitude, le jardin fait 100 unités de large.)

### Scénarios

Comme dans l'exercice de golf que tu viens de résoudre, tu verras à gauche quatre points gris, un pour chacun des quatre scénarios. **Clique sur chaque point** pour afficher un scénario différent, mais cette fois, c'est `askNumberOfFlowers()` qui renverra un nombre différent à chaque fois.

Ton travail consiste à écrire un seul programme qui fonctionne pour toutes les valeurs que `askNumberOfFlowers()` peut renvoyer.

Bonne chance !
