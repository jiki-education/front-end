---
title: "Les tableaux"
description: "Une chaîne ordonnée d'éléments (strings, nombres, booléens ou n'importe quoi d'autre) reliés ensemble en une seule valeur que Jiki peut manipuler."
en_md5: d26ccb9e04fbc77129f3199d63a95017
---

Jusqu'ici, on a utilisé des nombres, des strings et des booléens, le terme savant pour « vrai » et « faux », et on appelle tout ceci des « types de données » (_data types_ en anglais). Maintenant, on ajoute notre premier « type de données composé » (_compound data type_ en anglais).

C'est un type de données qui peut contenir plusieurs choses, pas juste une seule, et ce type de données s'appelle un « tableau » (_array_ en anglais).

Quand tu entends le mot tableau, je veux que tu penses à une chaîne physique qui relie plein de choses entre elles.

Ces choses qu'elle contient peuvent être n'importe quoi : des strings, des nombres, des booléens, même d'autres tableaux, même des choses que tu n'as pas encore apprises, mais ne nous en occupons pas pour l'instant.

Tout ce qui se trouve dans cette chaîne est ordonné, et cet ordre est celui dans lequel les éléments ont été enchaînés.

Donc, un tableau contient plein de choses. Mais c'est un seul et unique tout : un seul tableau, avec plein d'éléments à l'intérieur.

Jiki peut prendre ce tableau, cette chaîne, et le mettre dans une boîte, exactement comme il peut mettre une string ou un nombre dans une boîte.

Il peut le glisser dans l'entonnoir d'une machine. Il peut le récupérer sur le tapis roulant. Ce tableau est une seule chose, et Jiki le manipule exactement de la même façon que les strings, les nombres et tout ce que tu as vu jusqu'ici.

En code, un tableau ressemble d'ailleurs un peu à une chaîne, lui aussi. Il a un crochet à chaque extrémité, puis plein d'éléments enchaînés les uns aux autres, séparés par des virgules.

Par exemple, si on voulait créer un tableau avec les noms de quelques-uns de nos mentors, on pourrait préparer une boîte appelée `mentors` et mettre cette chaîne à l'intérieur.

On écrirait `let mentors =`, exactement comme pour n'importe quelle autre boîte, puis on aurait un crochet ouvrant, plein d'éléments, leurs noms séparés par des virgules, et enfin un crochet fermant. Quand Jiki voit ça, il va chercher quatre bouts de papier, un pour chaque nom, puis il prend une nouvelle chaîne, y attache le tout et met cette chaîne dans la boîte `mentors`.

Tu peux mettre ce que tu veux dans un tableau : des strings, des nombres, des booléens, et même un mélange de tout ça.

Voici différents exemples de tableaux parfaitement valides.

Tu peux aussi créer un tableau vide. C'est juste une chaîne sans élément. Ça reste quand même une chaîne à part entière, toujours avec ses extrémités des deux côtés : simplement, elle ne contient aucun élément. Et tu peux quand même mettre ce tableau vide à l'intérieur d'une boîte, le récupérer et l'utiliser plus tard.

Tu sais donc créer un tableau avec la syntaxe des crochets, mais comment est-ce qu'on les utilise concrètement ? Comment vérifier ce qu'ils contiennent et en récupérer des choses ? Eh bien, exactement de la même façon que quand on voulait récupérer des lettres d'une string. On peut utiliser la syntaxe des crochets avec des nombres à l'intérieur.

Alors revenons à notre tableau de mentors. Si on veut récupérer le premier mentor, on écrit `mentors[0]`. Souviens-toi qu'en JavaScript, on compte à partir de zéro.

Et on peut aussi parcourir un tableau exactement comme on a parcouru des strings avant, avec `for-of`.

Les tableaux fonctionnent exactement de la même façon. Cette fois, la seule différence, c'est qu'au lieu de récupérer une lettre, on récupère l'élément du tableau, quel qu'il soit. Dans cet exemple, c'est le nom du mentor.

Donc, la première fois qu'on remercie quelqu'un, on remercie `"DJ"`. La deuxième fois, on remercie `"Becky"`, et ainsi de suite.

On peut aussi utiliser la propriété `length` sur les tableaux, exactement comme on l'a appris avec les strings. Si on a un tableau avec quatre strings dans la boîte `mentors` et qu'on écrit `mentors.length`, ça renverra « quatre ».

Et on peut utiliser `includes` exactement de la même manière sur les tableaux. On peut écrire `mentors.includes("DJ")`, et ça renverra `true`. Mais si on écrit `mentors.includes("Frank")`, ça renverra `false`.

Tout fonctionne exactement pareil qu'avec les strings. Simplement, là, on travaille avec les éléments d'un tableau, et non pas avec les lettres d'une string.
