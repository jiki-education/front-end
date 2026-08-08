---
title: "Pingouin"
description: "Complète un dessin symétrique de pingouin."
en_md5: bff370c28fd178d8c0ac9f65e3384e81
---

Dans cet exercice, on dessine des ellipses pour la première fois, et on réfléchit aussi un peu plus à la symétrie évoquée dans « Tête de renard ».

Cet exercice utilise des ellipses. Une ellipse, c'est comme un cercle étiré. On indique toujours le point central, mais au lieu d'un seul rayon, on en utilise deux : le rayon horizontal et le rayon vertical. Si le rayon vertical est plus grand que le rayon horizontal, l'ellipse paraît allongée en hauteur. Et si le rayon horizontal est plus grand que le vertical, elle paraît aplatie. Si tu donnes la même valeur aux deux rayons, tu retrouves un cercle !

La fonction `ellipse` prend 5 arguments : la position du centre (`centerX`, `centerY`), le rayon horizontal (`radiusX`), le rayon vertical (`radiusY`) et la couleur :

<img src="/static/images/exercise-assets/penguin/intro-ellipse.webp" alt="Schéma de la fonction ellipse" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Le pingouin

Ta mission est de dessiner la moitié droite du pingouin, en essayant de le faire **SANS** survoler les coordonnées ni les deviner. Le dessin terminé devrait ressembler à ceci :

<img src="/static/images/exercise-assets/penguin/penguin-finished.webp" alt="Pingouin" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

On a déjà dessiné la moitié de l'image pour toi. En lisant le code qui s'y trouve, tu devrais pouvoir déduire les autres valeurs pour rendre le dessin symétrique. Rappelle-toi : le coin supérieur gauche du canvas est `0,0`, et le coin inférieur droit est `100,100`. Le pingouin est placé au centre. Pour le bec, tu dois **modifier** les coordonnées du milieu du triangle. N'ajoute pas de nouveau triangle.

**Commence par appuyer sur _« Exécuter le code »_** pour voir à quoi ressemble l'image de départ. Amuse-toi bien !
