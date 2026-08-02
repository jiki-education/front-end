---
title: "Luhn"
description: "Valide des numéros d'identification, comme les numéros de carte bancaire, grâce à la somme de contrôle de Luhn."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

On vient de voir comment valider les numéros ISBN des livres. Il existe une autre formule, fréquemment utilisée, qui sert à vérifier des numéros dans de nombreux contextes : la formule de Luhn. Elle est surtout connue pour détecter les fautes de frappe dans les numéros de carte bancaire.

### La vérification de Luhn

La vérification de Luhn se fait en plusieurs étapes :

- En partant du chiffre **le plus à droite** et en allant vers la gauche, **on double la valeur d'un chiffre sur deux**.
- Si le doublement d'un chiffre donne un nombre supérieur à 9, on lui soustrait 9.
- On additionne ensuite tous les chiffres.
- Si le total est divisible par 10, le numéro est valide.

Par exemple, avec `"067"`, on suit les étapes :

```
0   6   7     // chiffres d'origine
0  12   7     // un chiffre sur deux (en partant de la droite) doublé
0   3   7     // 12 est supérieur à 9, donc on soustrait 9 → 3
       10     // On additionne les chiffres
     true     // 10 est divisible par 10, donc 067 est valide
```

### À toi de jouer

Crée une fonction appelée `valid` qui prend une string et renvoie `true` si elle passe la vérification de Luhn, et `false` si ce n'est pas le cas.

Les numéros sont donnés sous forme de strings et peuvent contenir des espaces pour faciliter la lecture (par exemple `"4539 1488 0343 6467"`). Ces espaces doivent être ignorés.

Quelques remarques importantes :

- L'entrée peut contenir des espaces : tu dois les ignorer.
- Si l'entrée contient n'importe quel autre caractère, tu dois renvoyer false.
- Les strings de longueur 1 ou moins (une fois les espaces retirés) ne sont **pas** valides.

### Mets en pratique ce que tu as appris

Il existe de nombreuses façons de résoudre cet exercice, mais la solution attendue ici passe par l'utilisation d'une boucle `for`.

Tu auras aussi besoin de la fonction <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> déjà vue dans l'exercice précédent.

Amuse-toi bien !
