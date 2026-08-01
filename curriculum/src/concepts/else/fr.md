---
title: "Else"
description: "Ajouter une clause `else` après un `if` pour qu'un autre bloc d'instructions s'exécute quand la condition se révèle fausse."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Les instructions `if` te permettent de vérifier des conditions et de n'exécuter du code que quand quelque chose est vrai. Voyons maintenant le complice de `if` : `else`.

Avec une instruction `if` (_if statement_ en anglais), Jiki exécute le bloc d'instructions quand la condition est vraie, et il saute ce bloc quand elle est fausse. Mais si tu veux que Jiki fasse une chose quand la condition est vraie et une autre quand elle est fausse ? C'est justement à ça que sert else. On peut placer une clause else après l'accolade fermante du if, et Jiki l'exécutera si la condition du if est fausse. Si on reprend l'exemple du videur de la boîte de nuit, on a maintenant le choix entre ouvrir la porte et renvoyer la personne, ce qui vaut sans doute mieux que de l'ignorer complètement comme on le faisait jusqu'ici. Imagine une bifurcation sur la route : Jiki arrive à cette bifurcation, il vérifie la condition, puis il part d'un côté si elle est vraie, ou de l'autre si elle est fausse. Mais il ne prend jamais les deux chemins à la fois.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Une bifurcation devant la porte de la boîte de nuit : ouvrir la porte quand la condition est vraie, renvoyer la personne quand elle est fausse"
  width="500"
  height="332"
/>

Mais que se passe-t-il si tu as plus de deux possibilités ? Imagine que notre videur vende des billets. Moins de treize ans : billet enfant. Entre treize et vingt ans : billet ado. Vingt ans ou plus : billet adulte. Ça fait donc trois résultats possibles. Pour ça, on peut ajouter une autre instruction if après le else. On peut donc dire : « Si ceci, fais ceci. Sinon, si cela, fais cela. Sinon, fais cette autre chose. » Dans cet exemple, Jiki voit le if et vérifie la première condition. Est-ce que seize est inférieur à treize ? Non. Il passe donc au else if. Est-ce que seize est inférieur à vingt ? Oui, c'est vrai. Il exécute donc ce bloc et donne un billet ado. Et ensuite, il a terminé. Il ne vérifie plus rien. Il ne regarde même pas ce dernier else. Dès que Jiki trouve une condition vraie, il exécute le bloc correspondant et saute tout ce qui vient en dessous.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

C'est le point essentiel à comprendre : un seul bloc s'exécute, jamais plus. Jiki parcourt cette chaîne de conditions, trouve la première qui est vraie, exécute le bloc correspondant, puis passe à la suite.

Maintenant, il y a une chose à vraiment bien comprendre, parce qu'elle piège beaucoup de monde. Il existe une différence subtile mais très importante entre écrire deux instructions if séparées et utiliser else if. Imagine qu'on crée un programme qui donne soit un prix de base, soit un prix bonus selon le score de quelqu'un. Regarde ces deux possibilités : l'une utilise else if, l'autre deux instructions `if` séparées. Qu'est-ce qui va se passer de différent ?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

Dans le premier cas, avec le else if, on vérifie si le score est élevé et on donne le prix, puis on n'exécute pas le else if. Donc si la personne a un score supérieur à cent, elle reçoit uniquement le prix bonus.

Mais dans le second exemple, les deux if sont totalement indépendants. Les deux s'exécutent, et les deux conditions sont vraies. La personne reçoit donc deux prix. Dans le premier cas, un prix ; dans le second, deux. Prends un instant pour t'assurer que tu as vraiment bien compris.

Au passage, il est intéressant de noter que l'une ou l'autre version peut être la bonne selon la façon dont le jeu est conçu. Peut-être que le participant reçoit un prix normal plus un prix bonus, ou peut-être qu'il passe simplement au prix bonus. Aucun des deux morceaux de code n'est juste ou faux en soi : ils sont simplement utiles dans des situations différentes. Mais tu dois savoir lequel tu as l'intention d'utiliser.
