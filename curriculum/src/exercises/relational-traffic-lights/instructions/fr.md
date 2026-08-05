---
title: "Feu tricolore relationnel"
description: "Reconstruis ton feu tricolore pour que tout se redimensionne ensemble."
en_md5: d54633094a8d14f73b298fe4827504c4
---

Te revoilà devant le feu tricolore ! Cette fois, on va suivre le même principe que dans les deux exercices précédents et construire le feu tricolore de façon à ce que tout se redimensionne correctement quand on change le rayon. Pour y arriver, on dispose d'une série de variables à définir par rapport à `center` (le centre), à `radius` (le rayon), ou aux deux.

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Le feu tricolore à obtenir" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Comment ça marche

- Le coin en haut à gauche du canvas est `0,0`. Le coin en bas à droite est `100,100`.
- Les variables de couleur et `center` sont déjà fixées pour toi. `radius` est préréglé à 10, mais tu peux t'amuser à le modifier.
- Tu dois calculer toutes les variables de position et de taille comme une combinaison de `radius` et/ou de `center`.
- Le boîtier est un rectangle qui entoure les trois feux, avec une marge tout autour. Cette marge est égale au rayon.
- Les trois feux sont répartis régulièrement à la verticale dans le boîtier, et le boîtier est au centre de l'image. (Le centre du cercle jaune est donc le centre de l'image.)

### Les variables à calculer

Toutes ces variables doivent utiliser `radius` ou `center` (par exemple une formule comme `radius * 7` ou `center - (radius * 2)`).

- `redY` (y du rouge), `yellowY` (y du jaune), `greenY` (y du vert) : les centres verticaux de chaque feu
- `housingX` (x du boîtier), `housingY` (y du boîtier) : le coin en haut à gauche du rectangle du boîtier
- `housingWidth` (largeur du boîtier), `housingHeight` (hauteur du boîtier) : la taille du rectangle du boîtier

### Teste la mise à l'échelle

Pendant que tu travailles, tu peux faire varier le rayon de `2` à `12` pour voir si tout se redimensionne correctement. Si ton code est correct, tout doit rester bien proportionné autour du centre de l'image !
