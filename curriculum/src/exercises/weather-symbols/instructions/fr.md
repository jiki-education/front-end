---
title: "Symboles météo"
description: "Dessine des prévisions météo sur six jours à partir d'un tableau de descriptions."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

On t'a demandé de préparer des prévisions météo sur six jours. Mais au lieu de recevoir des données météo classiques, ton patron te donne des descriptions du temps selon ce qu'il en pense (par exemple « Snowboarding time! 🏂 » ou « Miserable 😩 »).

Tu reçois un tableau (_Array_ en anglais) de six descriptions météo, une par jour, et ton travail consiste à dessiner la météo de chaque jour dans sa propre boîte.

Les prévisions s'affichent sous la forme d'une grille de six boîtes, une pour chaque jour de la semaine, du lundi au samedi. Les descriptions se suivent dans l'ordre : la première (boîte `0`) correspond à la météo du lundi, la deuxième (boîte `1`) à celle du mardi, et ainsi de suite jusqu'au samedi (boîte `5`). (Ton patron ne sort jamais de chez lui le dimanche, donc la météo de ce jour-là lui est égale, et on ne peut donc jamais l'annoncer...)

## Dessiner un jour

On te fournit une fonction `draw` (dessiner) qui fait tout le travail artistique pour toi. Ton travail consiste à trouver les bons éléments à mettre dedans.

```js
draw(box, day, elements)
```

- `box` est la boîte dans laquelle dessiner (de `0` à `5`).
- `day` est le jour de la semaine à inscrire sur la boîte, par exemple `"Monday"`.
- `elements` est un tableau de symboles météo à afficher (voir les détails plus bas).

Les jours de la semaine, dans l'ordre, sont `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` et `"Saturday"`.

Donc si le premier jour est `"Exciting 🤩"`, tu écriras :

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Ce que signifie chaque description

Chaque description correspond à un tableau précis de symboles :

- `"Sunny ☀️"` : `["sun"]`
- `"Dull 😴"` : `["cloud"]`
- `"Miserable 😩"` : `["cloud", "rain"]`
- `"Hopeful 🤞"` : `["sun", "cloud"]`
- `"Rainbow territory! 🌈"` : `["sun", "cloud", "rain"]`
- `"Exciting 🤩"` : `["cloud", "snow"]`
- `"Snowboarding time! 🏂"` : `["sun", "cloud", "snow"]`

## À toi de jouer

Parcours les jours du tableau `days` un par un. Transforme chaque description obtenue en un tableau contenant la bonne suite de symboles, puis utilise `draw` pour les dessiner dans une boîte étiquetée avec le jour de la semaine correspondant.
