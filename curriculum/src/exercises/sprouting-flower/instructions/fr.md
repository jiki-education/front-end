---
title: "La fleur qui pousse"
description: "Utilise les relations entre variables pour animer une fleur qui pousse depuis le sol."
en_md5: acd8f364af4cfdc8f76ced2b17539bbb
---

Ta mission est de faire pousser une fleur au fil de `60` itérations.

L'animation doit ressembler à ceci.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Images montrant une fleur qui pousse depuis le sol sur 60 itérations" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

La clé de cet exercice, c'est de construire des relations entre les différents éléments. C'est une compétence essentielle en programmation.

**Avant de lire la suite des instructions**, prends quelques minutes pour réfléchir à la façon d'y arriver. Note sur un bout de papier les étapes que tu penses devoir suivre.

**Une fois que tu as une solution** qui te convient (ou que tu as abandonné), **fais défiler la page vers le bas** pour voir les instructions.

---

## Comment résoudre l'exercice

L'élément central, c'est le centre de la fleur : tout le reste peut se calculer à partir de ce point. À chaque itération de la boucle, le point central doit monter de `1` (avant de dessiner).

Voici d'autres choses à savoir :

- Le coin en haut à gauche du canvas est `0,0`, et le coin en bas à droite `100,100`.
- Le rayon de la fleur commence à `0` et doit augmenter de `0.4` à chaque itération (avant de dessiner).
- Le rayon du pistil (la partie jaune au milieu de la fleur) commence à `0` et doit augmenter de `0.1` à chaque itération (avant de dessiner).
- La tige doit partir du centre de la fleur et descendre jusqu'au sol.
- La largeur de la tige représente 10 % de sa hauteur, donc `stemHeight / 10` (la hauteur de la tige divisée par 10).
- Tout est centré sur l'axe horizontal.
- Les feuilles sont collées contre la tige, une de chaque côté.
- Les feuilles se situent à mi-hauteur de la tige.
- Le `radiusX` (la largeur radiale) des feuilles représente 50 % du rayon de la fleur.
- Le `radiusY` (la hauteur radiale) des feuilles représente 20 % du rayon de la fleur.
- La tête de la fleur peut être `"red"` ou `"pink"`, selon tes goûts. Le pistil (le centre de la fleur) doit être `"yellow"`, l'herbe `"green"` et l'arrière-plan `"skyblue"`.

Il est **essentiel** de travailler sur une seule chose à la fois :

- Commence par dessiner la fleur rose et par la faire monter.
- Ensuite, fais-la grandir.
- Ajoute le petit centre jaune.
- Ajoute la tige.
- Ajoute la feuille gauche.
- Ajoute la feuille droite.

Utilise la barre de lecture pour parcourir le code et repérer où les choses tournent mal.

### Un exercice difficile

Cet exercice est exigeant, alors prends ton temps. Si tu es vraiment bloqué, demande de l'aide, et pense à nous donner un maximum d'informations sur ce qui ne fonctionne pas et sur ce qui, selon toi, en est la cause.

Utilise la barre de lecture (en bas à gauche) pour vérifier la valeur de tes variables si tu ne comprends pas bien ce qui se passe. Clique sur le petit bouton pour afficher des informations sur chaque ligne.

N'oublie pas : c'est en se confrontant à la difficulté qu'on apprend. Chaque fois que tu te trompes puis que tu résous le problème, tu deviens un peu plus programmeur. Un jour, tout cela te semblera facile. Continue, tout simplement.
