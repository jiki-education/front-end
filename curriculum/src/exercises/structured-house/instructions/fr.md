---
title: "La maison structurée"
description: "Pilote tout le dessin d'une maison à partir de deux variables d'ancrage."
en_md5: 783a94e5de5f4bd22cd634e07eabc131
---

Ta mission est de dessiner une maison, en construisant l'ensemble à partir de deux variables d'ancrage seulement : `houseWidth` (largeur de la maison) et `houseHeight` (hauteur de la maison).

On a préparé pour toi les couleurs, la largeur du canvas et les deux variables d'ancrage. Tout le reste (l'emplacement de la maison, le toit, les fenêtres, la porte et la poignée) doit être calculé à partir de ces deux ancrages et des données fixes ci-dessous.

**Pense en termes de relations !** Si tu t'y prends bien, tu devrais pouvoir modifier uniquement `houseWidth` et `houseHeight`, et toute la maison se redimensionnera correctement : elle restera centrée horizontalement, posée sur l'herbe, et gardera ses proportions. Ne code pas en dur des positions que tu as calculées toi-même. Construis chacune d'elles à partir des ancrages.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="La même maison dessinée avec trois largeurs et hauteurs différentes, restant à chaque fois centrée et posée sur l'herbe" style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Spécifications de la maison

- Le coin en haut à gauche du canvas est `0,0`. Le coin en bas à droite est `100,100`.
- Le ciel remplit tout le canvas (de `0,0` à `100,100`).
- L'herbe occupe toute la largeur et se trouve en bas du canvas, avec une hauteur de `15`.
- La maison est toujours centrée horizontalement sur le canvas.
- Le bas de la maison se trouve `5` en dessous du haut de l'herbe, et la maison grandit vers le haut à partir de là.
- Le toit repose sur le cadre de la maison. Il dépasse du cadre, à gauche et à droite, de `1/10` de la largeur du cadre, sa hauteur vaut `1/2` de la hauteur du cadre, et sa pointe est centrée horizontalement.
- Les fenêtres ont chacune une largeur de `1/5` de la largeur du cadre et une hauteur de `1/3` de sa hauteur. Elles se trouvent `1/8` de la hauteur du cadre en dessous du haut du cadre, et sont en retrait de `1/7` de la largeur du cadre par rapport à chacun de ses côtés.
- La porte a une largeur de `1/5` de la largeur du cadre et une hauteur de `1/2` de sa hauteur. Elle est centrée horizontalement, et son bas se trouve en bas de la maison.
- Le rayon de la poignée de porte est de `1/10` de la largeur de la porte. Il y a un écart de `1/10` de la largeur de la porte entre la poignée et le bord droit de la porte. La poignée est centrée verticalement dans la porte.

### Vérifie que ça fonctionne !

Essaie de modifier les variables `houseWidth` et `houseHeight`. Si le code est correct, la maison se redimensionnera tout en restant centrée et posée sur l'herbe.
