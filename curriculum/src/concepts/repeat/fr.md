---
title: "La boucle repeat"
description: "Utiliser le mot-clé `repeat` pour dire à Jiki d'exécuter le code entre les accolades un certain nombre de fois."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Jusqu'ici, tout a été écrit de façon linéaire : Jiki suit chaque instruction dans l'ordre, de haut en bas.

Maintenant, on va voir comment Jiki peut sortir de ce déroulement strict de haut en bas, et plus précisément comment on peut lui demander d'exécuter la même section de code plusieurs fois de suite.

Par exemple, imagine que tu es dans le labyrinthe et que tu veux avancer de 10 pas. Il existe une fonction `walk` (marcher) pour t'aider, mais que se passerait-il si elle n'existait pas ? Si tu n'avais que la fonction `move` (avancer) ?

Plutôt que d'écrire `move` 10 fois de suite, ce qui devient très répétitif, ce qu'il nous faut, c'est pouvoir dire : « Hé, Jiki, fais 10 fois la prochaine instruction que je te donne.

`Move`. »

Pour faire ça en code, on va utiliser notre premier mot-clé (_keyword_ en anglais). Les mots-clés sont des instructions que Jiki comprend. Ils ressemblent un peu à des machines, mais ce n'en sont pas. Quand Jiki voit un mot-clé, il ne cherche pas une machine sur l'étagère : il sait directement quoi faire. C'est intégré dans son cerveau. Il existe une vingtaine de mots-clés différents qu'on va apprendre au fil du cours, et le premier d'entre eux est le mot-clé `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki entouré de mots-clés comme repeat, if, else, and, or, avec la note que les mots-clés sont des instructions que Jiki comprend"
  width="358"
  height="400"
/>

Le mot-clé `repeat` fait exactement ce que je viens de décrire. Il dit à Jiki : « Répète ce qui suit autant de fois que je te l'indique. » Regarde ce code. D'abord, on utilise le mot-clé `repeat` pour dire à Jiki qu'il va faire quelque chose plusieurs fois. Ensuite, on met entre parenthèses le nombre de fois que Jiki doit répéter la chose, puis viennent ces accolades (`{}`), à l'intérieur desquelles se trouvent les choses qu'on veut que Jiki répète. Ce schéma est incroyablement courant en programmation : on écrit un mot-clé, généralement accompagné d'une information (ici, le nombre de fois qu'il faut faire quelque chose), puis un bloc de code (_code block_ en anglais) entre accolades. Donc, pour revenir au monde du labyrinthe, plutôt que d'écrire `move`, `move`, `move`, `move`, on peut écrire : répète quatre fois `move`.

```javascript
repeat(4) {
  move()
}
```

Jiki verra ce code et utilisera la machine `move` quatre fois de suite.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki qui utilise la machine move quatre fois de suite, l'une après l'autre"
  width="421"
  height="400"
/>

Et on n'est pas limité à une seule chose entre ces accolades. Jiki peut faire plusieurs choses de façon répétée. On peut dire à Jiki de `move`, puis de `turnLeft`, et de répéter tout ça quatre fois. Si Jiki voit ce code, il utilisera la machine `move`, puis la machine `turnLeft`, puis la machine `move`, puis la machine `turnLeft`, puis la machine `move`, etc., jusqu'à avoir fait quatre fois les deux instructions.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki qui utilise la machine move puis la machine turnLeft, en répétant la paire d'actions quatre fois"
  width="500"
  height="390"
/>

Ces instructions de répétition sont appelées des boucles (_loops_ en anglais), et il existe plein de boucles différentes, qui fonctionnent chacune un peu différemment.

Il reste une dernière chose à savoir : garder un code propre et bien rangé devient essentiel quand on travaille avec des boucles. Quand ton code a une bonne structure visuelle, on voit très facilement ce qui se passe. Mais si ce n'est pas le cas, si tu oublies d'indenter proprement (c'est-à-dire de décaler le début des lignes avec des espaces, pour montrer à quel bloc de code elles appartiennent) ou si tu mélanges tes indentations, ça devient vite très confus. Alors dans ce cours, on suit toujours une règle. Tu mets toujours l'accolade ouvrante sur la même ligne que l'instruction (_statement_ en anglais) `repeat`. Tu mets toujours l'accolade fermante sur sa propre ligne après l'instruction, et tu indentes toujours le code qui se trouve entre ces deux lignes avec deux espaces. Comme ça, tout restera bien net, et si tu oublies ou si tu essaies de suivre un autre schéma, tu obtiendras une erreur.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki qui montre l'indentation et le retour à la ligne qui gardent le bloc de code d'une boucle bien net"
  width="500"
  height="398"
/>
