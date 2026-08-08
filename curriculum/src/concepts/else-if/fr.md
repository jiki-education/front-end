---
title: "L'instruction `else if`"
description: "Enchaîner des clauses `else if` pour vérifier plusieurs conditions dans l'ordre, en n'exécutant que le premier bloc dont la condition est vraie."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Tu as vu comment `if` et `else` t'offrent deux chemins : faire une chose quand une condition est vraie, en faire une autre quand elle est fausse. Mais que se passe-t-il si tu as plus de deux possibilités ?

Imagine que notre videur vende des billets. Moins de treize ans, tu as un billet enfant. Entre treize et vingt ans, un billet ado. Vingt ans ou plus, c'est un billet adulte. On a donc maintenant trois résultats différents. Pour ça, on peut ajouter une autre instruction `if` après le `else`. On peut donc dire : « Si _ceci_, fais ci, si _cela_, fais ça. Sinon, fais cette autre-là. » Dans cet exemple, Jiki voit donc l'instruction `if` et vérifie la première condition. Est-ce que seize est inférieur à treize ? Non. Il passe donc au `else if`. Est-ce que seize est inférieur à vingt ? Oui, c'est vrai. Il exécute donc ce bloc et donne un billet ado. Et là, il a terminé. Il ne vérifie rien d'autre. Il ne regarde même pas le `else` final. Dès que Jiki trouve une condition vraie, il exécute le bloc correspondant et saute tout ce qui vient en dessous.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Trois billets marqués CHILD, TEEN et ADULT, un pour chaque résultat de la vérification de l'âge"
  width="500"
  height="142"
/>

C'est le point essentiel à comprendre. Un seul bloc s'exécute, jamais plus. Jiki descend cet enchaînement, trouve la première condition vraie, exécute ce bloc, puis passe à la suite.

Maintenant, il y a une chose à vraiment bien comprendre, parce qu'elle piège beaucoup de monde. Il existe une différence subtile mais très importante entre écrire deux instructions `if` séparées et utiliser `else if`. Imagine qu'on crée un programme qui donne soit un prix de base, soit un prix bonus selon le score de quelqu'un. Regarde ces deux possibilités, l'une avec `else if`, l'autre avec deux instructions `if` séparées. Qu'est-ce qui va se passer de différent ?

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

Dans le premier cas, avec le `else if`, on vérifie si le score est élevé et on donne le prix bonus, puis on n'exécute pas le `else if`. Donc si la personne a un score au-dessus de cent, elle reçoit simplement le prix bonus.

Mais dans le second exemple, les deux `if` sont totalement indépendants. Les deux vont s'exécuter et les deux conditions seront vraies. La personne reçoit donc deux prix. Dans le premier cas : un prix, dans le second : deux. Prends un moment pour être sûr de bien comprendre ça.

Il est aussi intéressant de noter que l'une ou l'autre version peut être la bonne, selon la façon dont le jeu est conçu. Peut-être que le participant reçoit un prix de base ainsi qu'un prix bonus, ou peut-être reçoit-il seulement le prix bonus. Aucun des deux morceaux de code n'est juste ou faux. Ils sont simplement utiles dans des situations différentes. Mais tu dois savoir lequel tu as l'intention d'utiliser.
