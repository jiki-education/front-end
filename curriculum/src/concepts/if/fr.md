---
title: "L'instruction `if`"
description: "Utiliser le mot-clé `if` pour exécuter un bloc de code seulement quand une condition est vraie, comme un videur qui décide qui peut entrer."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Il existe un mot-clé qui nous permet de dire à Jiki de ne faire certaines choses que dans certaines situations. Imagine que tu écris du code pour garder l'entrée d'un bar, que tu es le videur, et que Jiki ne doit ouvrir la porte que si la personne est habillée comme il faut. Ou imagine que tu es chargé d'agiter le drapeau à damier à la fin d'une course, mais que Jiki doit savoir qu'il ne peut le faire qu'au dernier tour. Dans ce genre de situations, on va utiliser le mot-clé `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki en videur qui décide s'il laisse entrer les gens dans la boîte de nuit"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki prêt à agiter le drapeau à damier à la fin d'une course"
  width="266"
  height="400"
/>

On utilise le mot-clé `if` d'une manière très similaire à celle de `repeat`. On met une information entre parenthèses : dans ce cas, cette information est la condition que l'on vérifie. Et là, on met entre accolades un bloc de code qui ne s'exécute que si cette condition est vraie.

```javascript
if (condition) {
}
```

Alors, à quoi ressemblent ces conditions ? Eh bien, la plupart du temps, il s'agit d'une comparaison : on compare deux nombres ou deux strings, et on vérifie si le résultat est vrai ou faux.

Tu peux penser à ces comparaisons comme à des assertions (_statements_ en anglais) que tu pourrais dire à voix haute. Trois est inférieur à cinq : c'est vrai. Sept est inférieur à deux : c'est faux.

Pour écrire ces comparaisons, on utilise des symboles que tu connais sûrement déjà grâce aux maths : inférieur à, supérieur à, inférieur ou égal à, supérieur ou égal à. On a aussi un symbole pour vérifier si deux choses sont identiques, si elles sont égales. Et ce symbole-là est un peu différent de celui que tu utilises habituellement, parce qu'on écrit trois signes « égal » à la suite pour vérifier si deux choses sont identiques ou différentes.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Une liste des opérateurs de comparaison : inférieur à, supérieur à, inférieur ou égal, supérieur ou égal, égal et différent, avec des exemples"
  width="449"
  height="400"
/>

Ça nous évite de nous tromper quand on définit ou que l'on met à jour une variable, sachant qu'un seul signe « égal » veut dire « mets ça dans la boîte ». Retiens juste ceci : trois signes « égal » pour comparer.

Tu peux aussi comparer des strings. Par exemple, `"hello"` est égal à `"hello"` : c'est vrai, les deux strings sont identiques. Mais fais bien attention ici, parce que Jiki compare un par un chaque caractère des deux strings, sur les deux bouts de papier. Donc `"Hello"` avec un H majuscule n'est pas égal à `"hello"` avec un h minuscule : ce sont des strings différentes. Cette comparaison serait donc fausse, parce que le H majuscule et le h minuscule sont des caractères différents.

Au fait, « vrai » et « faux », on les appelle des booléens, et c'est encore un mot qui sonne technique. Mais en fait, c'est super simple : c'est juste une façon formelle de dire que quelque chose est soit « vrai », soit « faux ». Donc si tu croises le mot « booléen », ça veut juste dire « vrai » ou « faux ». Voyons tout ça en pratique. Imagine qu'on construit ce robot videur pour une boîte de nuit, et qu'on décide que le videur ne doit ouvrir la porte que si la personne a 21 ans ou plus. Eh bien, nous avons une fonction `askAge` (demander l'âge), qu'on peut utiliser pour obtenir l'âge de quelqu'un, et on va enregistrer le résultat dans une variable appelée `age` (âge). Ainsi, on peut dire que si cet `age` est supérieur à 20, on ouvre la porte. Donc, si `askAge` renvoie `30`, on l'ouvre, et si elle renvoie `12`, on ne l'ouvre pas.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki ouvre la porte à une personne assez âgée et refuse l'entrée à une personne trop jeune"
  width="410"
  height="400"
/>
