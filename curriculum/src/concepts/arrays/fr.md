---
title: "Les tableaux"
description: "Une chaîne ordonnée d'éléments (strings, nombres, booléens ou n'importe quoi d'autre) reliés ensemble en une seule valeur que Jiki peut manipuler."
en_md5: 012da550948ba2ebcfaf953cd0906f3f
---

Jusqu'ici, on a utilisé des nombres, des strings et des booléens, le terme savant pour vrai et faux, et on appelle tout ça des types de données (_data types_ en anglais). Maintenant, on ajoute notre premier type de données composé (_compound data type_ en anglais).

C'est un type de données qui peut contenir plusieurs choses, et pas une seule, et ce type de données s'appelle un tableau (_array_ en anglais).

Quand tu entends le mot tableau, je veux que tu penses à une chaîne physique qui relie plein de choses entre elles.

Ces choses qu'elle retient peuvent être n'importe quoi : des strings, des nombres, des booléens, même d'autres tableaux, même des choses que tu n'as pas encore apprises, mais ne nous en occupons pas pour l'instant.

Tout ce qui se trouve dans cette chaîne est en ordre, l'ordre dans lequel les éléments ont été enchaînés.

Un tableau contient donc plein de choses, mais c'est un seul élément bien solide, une seule chose, un seul tableau avec plein d'éléments à l'intérieur.

Jiki peut prendre ce tableau, cette chaîne, et le mettre dans une boîte, exactement comme il peut mettre une string ou un nombre dans une boîte.

Il peut le glisser dans l'entonnoir d'une machine. Il peut le récupérer sur le tapis roulant. Ce tableau est une seule chose, et Jiki le manipule exactement de la même façon que les strings, les nombres et tout ce que tu as vu jusqu'ici.

En code, un tableau ressemble d'ailleurs un peu à une chaîne, lui aussi. Il a un crochet à chaque extrémité, puis plein d'éléments enchaînés les uns aux autres, séparés par des virgules.

Par exemple, si on voulait créer un tableau avec les noms de quelques membres de notre bootcamp, on pourrait préparer une boîte appelée `mentors` et mettre cette chaîne à l'intérieur.

On écrirait `let mentors =`, exactement comme pour n'importe quelle autre boîte, puis un crochet ouvrant, plein d'éléments, leurs noms séparés par des virgules, et enfin un crochet fermant. Quand Jiki voit ça, il va chercher quatre morceaux de papier, un pour chaque nom, puis il prend une nouvelle chaîne, y attache le tout et met cette chaîne dans la boîte `mentors`.

Tu peux mettre n'importe quoi dans un tableau : des strings, des nombres, des booléens, même un mélange de tout ça.

Voici différents exemples de tableaux parfaitement valides.

Tu peux aussi créer un tableau vide. C'est juste une chaîne sans éléments. C'est quand même une vraie chose : elle a toujours ses deux extrémités, c'est toujours une chaîne, simplement elle ne contient aucun élément. Mais tu peux quand même mettre ce tableau vide dans une boîte, le ressortir et l'utiliser plus tard.

Tu sais donc créer un tableau avec la syntaxe des crochets, mais comment est-ce qu'on les utilise concrètement ? Comment vérifier ce qu'ils contiennent et en sortir des choses ? Eh bien, exactement de la même façon que quand on voulait sortir des lettres d'une string. On peut utiliser la syntaxe des crochets avec des nombres à l'intérieur.

Revenons donc à notre tableau de mentors. Si on veut sortir le premier, on écrit `mentors[0]`. Souviens-toi qu'en JavaScript, on compte à partir de zéro.

Et on peut aussi parcourir un tableau exactement comme on a parcouru des strings avant, avec `for-of`.

Les tableaux fonctionnent exactement de la même façon. La seule différence, c'est que cette fois, au lieu de récupérer une lettre, on récupère l'élément du tableau, quel qu'il soit. Dans cet exemple, le nom du mentor.

La première fois qu'on remercie quelqu'un, on remercie `"DJ"`. La deuxième fois, on remercie `"Becky"`, et ainsi de suite.

On peut aussi utiliser la propriété `length` sur les tableaux, comme on l'a appris avec les strings. Si on a un tableau de quatre strings dans la boîte `mentors` et qu'on écrit `mentors.length`, ça renvoie quatre.

Et on peut utiliser `includes` exactement pareil sur les tableaux. On peut écrire `mentors.includes("DJ")`, et ça renvoie `true`. Mais si on écrit `mentors.includes("Frank")`, ça renvoie `false`.

Tout fonctionne exactement comme avec les strings. Simplement, on travaille avec les éléments d'un tableau, et non avec les lettres d'une string.
