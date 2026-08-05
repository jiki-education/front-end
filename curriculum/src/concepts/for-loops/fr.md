---
title: "Les boucles for"
description: "Une boucle en trois parties (une initialisation, une condition et une incrémentation) qui te donne un contrôle total sur l'itération."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Tu te souviens peut-être que la boucle repeat n'existe pas vraiment en JavaScript. C'est juste un ajout pour te simplifier un peu la vie pendant qu'on démarre.

Alors, qu'est-ce qu'on utilise à la place ? Eh bien, on utilise une boucle `for` normale, et ça ressemble à ceci.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Tu comprends maintenant pourquoi ça aurait pu paraître un peu intimidant le premier jour.

Mais aujourd'hui, tu as toutes les connaissances qu'il faut pour te sentir à l'aise avec ça. Alors, décomposons tout ça.

Une boucle `for` se compose de trois parties : une initialisation (_initializer_ en anglais), une condition et une incrémentation (_increment_ en anglais).

L'initialisation, cette petite partie `let i = 0`, s'exécute au tout début de la boucle. Elle ne s'exécute qu'une seule fois, et ici elle crée une boîte appelée `i` qui vaut zéro. `i` est simplement une lettre qui sert à suivre une valeur au fil de la boucle ; traditionnellement, on utilise `i` ou `x` pour ça.

La partie suivante, la condition, s'exécute à chaque fois, juste avant chaque itération de la boucle.

Si la condition est vraie, on exécute la boucle une nouvelle fois.

Si elle ne l'est pas, on ne l'exécute pas.

Et enfin vient l'incrémentation, le `i++`.

`i++` veut simplement dire la même chose que `i = i + 1`. C'est juste un raccourci, une façon d'augmenter `i` de un à chaque tour de boucle.

Donc dans cet exemple, on met `i` à zéro. On vérifie si `i` est inférieur à deux, ce qui est le cas, donc on exécute la boucle.

Puis, à la fin, on augmente `i` de un, donc `i` devient un. Zéro plus un, ça fait un.

Et on recommence. On vérifie si un est inférieur à deux.

C'est le cas, donc on exécute la boucle. Et à la fin, on augmente encore `i` de un. Il vaut maintenant deux, puisque un plus un font deux.

```javascript
i = 0
i < 2 // true - on exécute la boucle
...   // On fait l'itération
i = i + 1 // 1

i < 2 // true - on exécute la boucle
...   // On fait l'itération
i = i + 1 // 2

i < 2 // false - on sort de la boucle
```

Et on repart une troisième fois. Cette fois, on vérifie si deux est inférieur à deux, et comme ce n'est pas le cas, on n'exécute pas la boucle ; on en a terminé avec elle. On passe simplement au code suivant. Au final, on a exécuté la boucle deux fois, et c'est bon à savoir : tant qu'on part de zéro avec une condition `i < n`, le nombre `n` correspond au nombre de fois où la boucle s'exécutera.

Donc, c'est la même chose que d'écrire `repeat two`.

Ce n'est donc pas difficile, mais c'est bien plus alambiqué que d'écrire simplement `repeat two`. L'avantage d'une boucle `for`, c'est que tu peux faire ce que tu veux dans ces trois emplacements. Tu peux partir d'un autre nombre, avancer de plus de un à chaque fois, compter à rebours, ou utiliser une condition qui dépend d'autre chose qu'un simple compteur. C'est cette flexibilité qui fait des boucles `for` le véritable couteau suisse de JavaScript.
