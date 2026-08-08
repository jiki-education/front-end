---
title: "Utiliser les fonctions"
description: "Dis à Jiki d'utiliser l'une de ses petites machines en écrivant son nom suivi de deux parenthèses."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Quand tu écris du code, ce que tu fais en réalité, c'est expliquer ce que tu veux voir se produire, dans une langue que l'ordinateur comprend. Il existe énormément de langages de programmation différents, et tout autant d'interprètes qui prennent ce que tu as écrit et qui le transforment en des « uns » et des « zéros » que l'ordinateur peut comprendre. Dans ce cours, ton interprète s'appelle Jiki. Le cours entier porte son nom. Le voici : c'est Jiki. Jiki sera ton ami tout au long de ce voyage à travers le code. Son travail consiste à interpréter le code que tu écris et à le transformer en uns et zéros avec lesquels l'ordinateur peut vraiment agir.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, l'interprète sympathique qui va t'accompagner tout au long de ce cours"
  width="421"
  height="400"
/>

Tout l'intérêt du code, c'est de donner à l'interprète, Jiki en l'occurrence, les bonnes instructions. Et les instructions que tu peux donner à Jiki sont très nombreuses, car il comprend énormément de choses. Il peut assembler des éléments avec d'autres, il peut faire quelque chose un grand nombre de fois, et il peut se dire : « Si ceci arrive, alors je dois faire cela. » Il peut retenir des choses, puis les réutiliser plus tard. Et si quelque chose ne va pas, il peut te signaler une erreur. On va voir tout cela au fil du cours. Mais l'essentiel à comprendre, c'est que tout ce que tu vas faire consiste à écrire des instructions sur un tableau blanc, que Jiki viendra ensuite lire et suivre.

Quand j'ai appris à coder il y a 34 ans, c'est ce modèle mental que je me suis construit, et c'est encore celui que j'ai aujourd'hui. Je comprends le fonctionnement d'un ordinateur jusqu'aux uns et aux zéros, mais très honnêtement, je n'y pense jamais. Dans ma tête, il y a un petit bonhomme qui vit à l'intérieur de l'ordinateur, et je lui dis quoi faire. Alors suis-moi sur cette approche, parce que ce modèle mental est puissant et que tu peux le construire toi aussi. Si tu commences à te représenter de façon très visuelle ce que fait ce petit bonhomme dans l'ordinateur, cela te rendra un immense service pendant que tu apprends à coder.

Commençons donc par l'un des concepts fondamentaux de la programmation : les fonctions (_functions_ en anglais). Les fonctions sont comme de petites machines que tu peux demander à Jiki d'utiliser. Et si on jette un œil dans l'entrepôt de Jiki, l'endroit où il passe son temps, tu verras qu'il a une étagère avec trois machines différentes dessus : `move` (avancer), `turnLeft` (tourner à gauche) et `turnRight` (tourner à droite).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Une étagère dans l'entrepôt de Jiki, avec trois machines dessus : move, turnLeft et turnRight"
  width="500"
  height="371"
/>

Quand tu as écrit `move` suivi des deux parenthèses, ce que tu as fait, c'est dire à Jiki d'aller chercher la machine `move` sur l'étagère, de tourner la manivelle, de la mettre en marche et de l'utiliser.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki fait rouler la machine move hors de l'étagère pour l'utiliser"
  width="439"
  height="400"
/>

Quand tu as écrit `turnLeft` suivi des parenthèses, tu as dit à Jiki d'aller chercher la machine `turnLeft` sur l'étagère et de l'utiliser. Et c'est ce schéma que tu vas réutiliser encore et encore : dès que tu veux utiliser une machine, tu écris son nom, puis ces parenthèses, ce qui dit à Jiki d'aller chercher la machine et de l'utiliser :

```javascript
move()
turnLeft()
```

Pour l'instant, on n'a pas vraiment besoin de se préoccuper de la façon dont cette machine fonctionne vraiment, de ce qui se passe à l'intérieur. On y reviendra beaucoup plus en détail plus tard. D'ailleurs, tu pourras bientôt fabriquer tes propres machines. Mais pour le moment, ne t'inquiète pas de tout ça. Pour chaque exercice, on te dira quelles machines se trouvent sur l'étagère de Jiki. Elles changeront d'un exercice à l'autre, et tu pourras t'en servir pour résoudre les exercices.
