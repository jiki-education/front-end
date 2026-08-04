---
title: "Les strings"
description: "Des morceaux de texte entre guillemets (une lettre, un mot, une phrase ou un paragraphe entier) que Jiki écrit sur du papier."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Quand tu veux utiliser un nombre, tu peux littéralement l'écrire tel quel, et Jiki comprend ce que tu veux dire. Mais que faire si tu veux utiliser une lettre, un mot ou une phrase ? Et si, par exemple, tu avais une entrée supplémentaire où préciser la couleur dans la fonction `rectangle` ou la fonction `circle` (cercle) ? Comment devrions-nous écrire la couleur pour pouvoir l'insérer dans la machine ? Si on écrit simplement le mot `green` (vert) ou `blue` (bleu), Jiki pensera qu'on parle d'une machine sur les étagères, et il dira : « Il n'y a pas de machine qui s'appelle ‹ green ›. Je ne sais pas quoi faire. »

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki, l'air perplexe, debout à côté de la machine rectangle, avec des points d'interrogation au-dessus de la tête"
  width="446"
  height="400"
/>

On a donc une règle : chaque fois qu'on a besoin d'utiliser du texte, il faut le mettre entre guillemets, des guillemets doubles. Et quand tu mets quelque chose entre guillemets comme ça, Jiki sort un bout de papier et y écrit ce que tu as placé entre ces guillemets, et ces bouts de papier, on les appelle des _strings_ (chaînes de caractères).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki écrivant le mot green sur un bout de papier, qui devient une string"
  width="398"
  height="400"
/>

Une _string_ peut être une seule lettre, un mot, une phrase, un paragraphe, même un livre entier. La règle, c'est que si c'est du texte, on le met entre guillemets, et ça devient une _string_.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Un tableau blanc montrant des strings de différentes longueurs entre guillemets : une seule lettre, un mot, une phrase et une adresse sur plusieurs lignes"
  width="500"
  height="398"
/>

Donc si on veut un rectangle bleu, on écrit le nombre pour sa position à gauche, sa position en haut, sa largeur et sa hauteur. Mais pour la cinquième entrée, on va écrire `"blue"` entre guillemets.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki va descendre la machine de l'étagère et mettre des pièces dans les quatre premiers entonnoirs. Ensuite, il écrira « blue » sur un bout de papier, il placera ce papier dans le cinquième entonnoir, puis il fera tourner la machine.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki glissant le papier blue dans le cinquième entonnoir de la machine rectangle, avec les pièces 10, 20, 30 et 40 dans les quatre premiers entonnoirs"
  width="500"
  height="392"
/>

« String », c'est un de ces mots techniques qui intimident un peu au début, mais en réalité ça veut juste dire du texte. Tu t'y habitueras très vite. Ça n'a rien de magique.
