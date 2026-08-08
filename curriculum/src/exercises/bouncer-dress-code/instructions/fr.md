---
title: "Videur : code vestimentaire"
description: "Combine la tenue de la personne, son âge et sa présence sur la liste des invités pour décider qui peut entrer."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Te revoilà dans ton petit boulot de videur, et ce soir tu travailles dans un établissement au code vestimentaire strict.

Ton travail consiste à vérifier la tenue vestimentaire de la personne, ainsi que son âge, puis à décider ce qu'il faut faire. Et cette fois, on te demande de suivre des règles plutôt « intéressantes ».

### Les règles

- On laisse entrer **toute personne** en tenue **de soirée** ou en tenue **chic** (qu'elle figure ou non sur la liste des invités) et on lui offre des canapés (ceux qui se mangent, pas ceux sur lesquels on s'assoit !)
- Aux **adultes** (18 ans ou plus) en tenue **de soirée**, on offre **aussi** du champagne.
- On laisse entrer les **enfants** (moins de 18 ans) dans une autre tenue **uniquement s'ils** figurent sur la liste des invités.
- Toutes les autres personnes sont refoulées.

Les catégories du code vestimentaire :

- **Tenue de soirée** correspond à `"ballgown"` ou `"tuxedo"`
- **Tenue chic** correspond à `"suit"` ou `"dress"`

### Tes capacités

Tu as trois fonctions pour obtenir des données :

- `getOutfit()` (obtenir la tenue) renvoie le nom de la tenue que porte la personne (par exemple `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (obtenir l'âge) renvoie son âge.
- `onGuestList()` (sur la liste des invités) renvoie vrai ou faux selon que la personne figure ou non sur la liste des invités.

Tu n'as le droit d'utiliser chacune de ces fonctions « d'obtention de données » qu'une seule fois dans la solution (sinon les gens vont devenir pénibles si tu n'arrêtes pas de leur redemander leur nom, etc. !)

Tu disposes ensuite de quelques actions :

- `offerChampagne()` (offrir du champagne) offre une coupe de champagne à la personne
- `offerCanapes()` (offrir des canapés) offre des canapés à la personne (tartare de saumon)
- `letIn()` (laisser entrer) laisse la personne entrer dans l'établissement
- `turnAway()` (refouler) refoule la personne

### Coder efficacement

Il existe de nombreuses façons de résoudre cet exercice. Ton objectif est d'assembler toutes ces règles de manière à ce que le code reste **clair à lire**. Réduis la duplication de code autant que possible.

Amuse-toi bien et bonne chance !
