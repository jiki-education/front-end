---
title: "Bonhomme de neige"
description: "Construis un bonhomme de neige avec trois cercles."
en_md5: b8c4b86ef84ef659b9e869fa6504c672
---

Cet exercice te présente la fonction `circle`, qu'on utilise avec 3 entrées (_inputs_ en anglais) :

- `centerX` (centre en x) : la position horizontale (x) du centre du cercle
- `centerY` (centre en y) : la position verticale (y) du centre du cercle
- `radius` (rayon) : la taille du cercle

Cette image devrait rendre les choses plus claires :

<img src="/static/images/exercise-assets/snowman-basic/intro-circle.webp" alt="Bonhomme de neige" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Dessine un bonhomme de neige

Ta mission est de dessiner trois cercles blancs pour construire un bonhomme de neige. Le bonhomme de neige a :

- Un grand cercle pour la **base**, en bas
- Un cercle moyen pour le **corps**, au milieu
- Un petit cercle pour la **tête**, en haut

Les trois cercles doivent tous être centrés horizontalement sur le canvas. Utilise l'image de référence comme guide.

Comme précédemment, tu dessines sur un canvas de 100 de large sur 100 de haut. Le coin en haut à gauche du canvas est donc `0,0`, le coin en bas à droite est `100,100`, et tu peux survoler le canvas avec la souris pour vérifier où quelque chose doit se placer. Pour te simplifier la vie, tous les nombres de cet exercice sont **divisibles par 5**.
