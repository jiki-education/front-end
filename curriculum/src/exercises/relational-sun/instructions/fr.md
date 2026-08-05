---
title: "Soleil relationnel"
description: "Positionne un soleil où tout est calculé à partir de variables."
en_md5: d8de4704a25f3733ddaaea16f0232005
---

Dans cet exercice, ta mission est de positionner un soleil dans le coin en haut à droite du ciel, à l'aide d'opérations arithmétiques et de variables. La contrainte principale, c'est que le bord du soleil doit toujours rester à un **écart** fixe du bord du canvas, quelle que soit la taille du soleil.

On a prédéfini quatre variables pour toi en haut du fichier :

- `canvasSize` (taille du canvas) : la taille du canvas, qui vaut `100`.
- `color` (couleur) : définie sur `"yellow"`.
- `gap` (écart) : la distance entre le bord du soleil et les bords supérieur et droit du canvas.
- `radius` (rayon) : le rayon du soleil.

### Une démarche en deux étapes

Pour résoudre cet exercice, il y a deux choses à faire.

#### 1. Définis des variables dérivées

Définis les variables `sunX` (position x du soleil) et `sunY` (position y du soleil), qui utilisent `gap`, `radius` et `canvasSize` pour placer le centre du soleil dans le coin en haut à droite.

#### 2. Dessine le cercle

Dessine un cercle à l'aide de `sunX`, `sunY`, `radius` et `color`.

## Flexibilité

Par défaut, `gap` vaut 10 et `radius` vaut 15. Commence par résoudre l'exercice avec ces valeurs, pour pouvoir t'appuyer sur l'arrière-plan et bien aligner les éléments. Quand ton code est correct, tu verras le cercle apparaître au bon endroit sur la page.

Attention cependant : pour réussir l'exercice, tu ne peux pas te contenter de « coder en dur » la valeur (c'est-à-dire lui donner directement un simple nombre). `sunX` et `sunY` doivent être des calculs qui font intervenir d'autres variables.

Une fois l'exercice réussi, clique sur _« Nettoyer le code »_, puis change les valeurs de `gap` et de `radius` en haut du fichier et exécute à nouveau ton code : tu verras le soleil grossir ou se déplacer tout en restant dans le coin.

Quand tu as terminé, clique sur _« Tableau de bord »_ en haut à droite pour continuer normalement.
