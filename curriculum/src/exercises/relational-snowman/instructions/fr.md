---
title: "Bonhomme de neige relationnel"
description: "Reconstruis ton bonhomme de neige pour que toutes les tailles découlent d'une seule variable."
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

Dans cet exercice, on construit encore un bonhomme de neige, mais comme dans l'exercice précédent, on s'y prend de façon à ce que tout puisse être calculé à partir d'une seule variable `size` (taille), grâce à l'arithmétique.

Selon la valeur de `size` que tu choisis, le bonhomme de neige doit grandir.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Bonhomme de neige aux tailles 1 à 5"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### Comment ça marche

- Le coin en haut à gauche du canvas est `0,0`. Le coin en bas à droite est `100,100`.
- Tu disposes d'une variable déjà écrite, `snowmanX` (le x du bonhomme de neige), qui donne le centre de l'image, et d'une variable `size` que tu peux faire varier de `1` à `5` pour faire grandir le bonhomme de neige.
- Toutes les autres variables sont à calculer à l'aide d'expressions arithmétiques.
- Le rayon de la tête vaut `size * 2`, celui du corps `size * 3` et celui de la base `size * 4`.
- Les cercles doivent se toucher : le corps repose directement sur la base, et la tête directement sur le corps. (Notre bonhomme de neige est un peu plus précaire que dans les exercices précédents : chaque boule de neige est posée exactement sur celle du dessous, sans qu'elles fondent l'une dans l'autre. Il doit faire un froid glacial !)
- Le bas du cercle de la base se trouve à `size` du bas du canvas.
- Tu dois calculer le centre des trois boules de neige.

### Les variables

Ta mission est de définir ces variables à partir des instructions ci-dessus.

- `headRadius` (rayon de la tête) : à calculer à partir de `size`
- `bodyRadius` (rayon du corps) : à calculer à partir de `size`
- `baseRadius` (rayon de la base) : à calculer à partir de `size`
- `baseY` (y de la base) : à calculer à partir de `size` et de `baseRadius` (la base repose sur le sol)
- `bodyY` (y du corps) : à calculer à partir de `baseY`, `baseRadius` et `bodyRadius`
- `headY` (y de la tête) : à calculer à partir de `bodyY`, `bodyRadius` et `headRadius`

### Joue avec la taille

Tu peux faire varier la taille de `1` à `5`, et le bonhomme de neige doit grandir. N'oublie pas d'appuyer sur _« Exécuter le code »_ après chaque changement.
