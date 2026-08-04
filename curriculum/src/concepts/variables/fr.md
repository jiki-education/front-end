---
title: "Créer et utiliser des variables"
description: "Des boîtes sur les étagères de Jiki qui stockent une valeur avec une étiquette, pour que tu puisses la récupérer plus tard dans ton code."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Les variables sont ce qui nous permet de stocker des informations. Quand on code, on a souvent besoin de garder un nombre ou une string pour plus tard, et c'est justement à ça que servent les variables. Alors prenons un peu de recul dans l'entrepôt de Jiki : tu verras qu'il possède un deuxième ensemble d'étagères. On connaît déjà les premières étagères, celles qui portent les fonctions, ces petites machines comme `move` et `rectangle`. Mais sur ce deuxième ensemble d'étagères, à la place des machines, tu peux voir plein de boîtes, et ces boîtes sont ce qu'on appelle des variables. Tu peux demander à Jiki d'y ranger n'importe quoi, puis, plus tard, de le ressortir. Chaque boîte a un nom, exactement comme les fonctions ont un nom, et chaque boîte ne contient qu'une seule chose. Pour l'instant, soit un nombre, soit une string. Mais on verra plus loin dans le cours comment y stocker des choses plus complexes.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Deux ensembles d'étagères dans l'entrepôt de Jiki : l'un étiqueté fonctions, avec des machines, l'autre étiqueté variables, avec des boîtes"
  width="500"
  height="173"
/>

Alors, comment dire à Jiki de fabriquer une boîte et d'y mettre quelque chose ? On utilise le mot-clé `let` (laisser). Le mot-clé `let` indique à Jiki qu'il doit fabriquer une nouvelle boîte. Tu peux l'imaginer en train de sortir un carton de son emballage et de le monter ; ensuite, il regarde ce qui vient après le mot `let` : c'est l'étiquette qu'il va coller sur cette boîte, ici `name` (nom). Il sort donc son stylo et écrit `name` sur l'étiquette. Puis il regarde ce qui vient après le signe égal. Ici, c'est mon prénom, `"Jeremy"`, et comme `"Jeremy"` est une string, il prend un bout de papier et y écrit `"Jeremy"`. C'est juste une string, exactement comme les couleurs avec lesquelles tu as travaillé jusqu'ici, et il met ce bout de papier dans la boîte.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki tenant un bout de papier où est écrite la string Jeremy, prêt à le mettre dans la boîte"
  width="373"
  height="400"
/>

On lui a donc demandé de fabriquer une boîte, d'y coller une étiquette et d'y mettre quelque chose, et maintenant il va poser la boîte sur l'étagère. À n'importe quel autre moment de ton programme, Jiki peut aller chercher cette boîte sur l'étagère et regarder ce qu'elle contient. Commence à te construire ce modèle mental. Je code depuis toujours, et quand j'écris du code, j'imagine encore que je mets quelque chose dans une boîte pour le ressortir plus tard. Quand tu vois ce mot-clé `let`, pense vraiment : « D'accord, ça veut dire que je fabrique une nouvelle boîte. »

Une précision sur les noms de variables, les étiquettes de ces boîtes. Il y a quelques règles à leur sujet. D'abord, un nom de variable ne peut pas contenir d'espaces. Si tu veux utiliser plusieurs mots pour l'étiquette d'une boîte, il faudra coller les mots les uns aux autres en mettant la première lettre de chaque mot en majuscule. C'est ce qu'on appelle le `camelCase` (camel = chameau, case = casse) : imagine les bosses d'un chameau qui poussent la première lettre de chaque nouveau mot vers le haut pour en faire une majuscule. Donc si tu veux une étiquette avec « mon nom » dessus, plutôt que d'écrire les deux mots séparés par un espace, il faudra l'écrire en un seul mot, avec le N en majuscule : « mon nom » (« my name » en anglais) devient ainsi `myName`.

Autre règle : chaque nom de variable doit être unique. Tu ne peux pas avoir deux boîtes avec la même étiquette, et une variable ne peut pas non plus porter le même nom qu'une fonction. Si tu l'oublies, Jiki va s'embrouiller et te donnera un message d'erreur.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki, l'air perplexe, devant deux boîtes qui portent toutes les deux l'étiquette name"
  width="485"
  height="400"
/>

Voyons maintenant à quel moment on pourrait vouloir utiliser une variable. Disons qu'on dessine un soleil dans le ciel. On sait qu'on peut utiliser la fonction `circle` (cercle) en lui donnant quatre entrées : `left` (gauche), `top` (haut), `radius` (rayon) et `color` (couleur). Mais à mesure qu'on dessine plein de choses et que tous ces nombres s'éparpillent dans le code, ça devient vraiment difficile à suivre et à lire. À la place, on peut créer une variable pour chacune de ces quatre valeurs, puis s'y référer plus tard. Notre objectif ici est de pouvoir utiliser la fonction `circle` en lui passant des noms de boîtes clairs et lisibles ; quand Jiki verra ces noms, il saura qu'il doit aller chercher les boîtes sur les étagères et utiliser ce qu'elles contiennent.

Créons donc ces variables. On commence par la position gauche du soleil. On utilise le mot-clé `let` pour dire à Jiki de créer une nouvelle boîte appelée `leftPosition` (position de gauche). Remarque le `camelCase`, avec le P en majuscule. Et on dit à Jiki quel nombre va dans la boîte. Il la pose sur les étagères, puis fait la même chose pour `topPosition` (position du haut), `radius` et `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Des boîtes étiquetées sur les étagères des variables, chacune contenant une valeur que Jiki ira chercher plus tard"
  width="500"
  height="378"
/>

À tout moment dans le code, on pourra se référer à ces variables, et Jiki ira sortir les valeurs pour les mettre dans une machine. L'autre grand avantage des variables, c'est que chaque fois qu'on veut dessiner quelque chose à la même position que le soleil, on peut réutiliser ces mêmes variables `leftPosition` et `topPosition`. Prends un autre exemple : imagine que tu construis un mur de 30 briques et que tu veux que toutes les briques aient la même largeur et la même hauteur. Il sera préférable de créer une variable pour la largeur et une pour la hauteur dès le début du code, puis de t'y référer par la suite. Ainsi, si plus tard tu veux changer cette largeur ou cette hauteur, il te suffira de la modifier en un seul endroit, et tout le reste se mettra à jour automatiquement.
