---
title: "Horloge numérique"
description: "Affiche l'heure correcte sur une horloge numérique au format 12 heures."
en_md5: e3decc089d371b7113f2657f7571c001
---

Dans cet exercice, on va utiliser deux nouvelles fonctions pour obtenir l'heure :

- `currentTimeHour()` (heure actuelle) : renvoie l'heure actuelle au format 24 heures (par exemple, un quart d'heure avant minuit, elle renvoie `23`), sous forme de nombre.
- `currentTimeMinute()` (minute actuelle) : renvoie la minute actuelle sous forme de nombre.

Ton travail consiste à mettre à jour une horloge numérique en fonction des nombres que ces fonctions renvoient.

L'horloge numérique attend les nombres au format 12 heures, accompagnés d'un `am` ou d'un `pm` (ce qu'on appelle le « meridiem »).

Par exemple :

- `7:45` -> `7:45am`
- `19:45` -> `7:45pm`

Pour afficher l'heure sur l'horloge, on utilise la fonction `displayTime(hour, minutes, meridiem)` (afficher l'heure).

Dans chaque scénario, l'heure actuelle change. À toi d'écrire un code qui fonctionne avec tous les scénarios. Dans le dernier scénario, on utilise la vraie heure actuelle, donc le scénario changera chaque fois que l'heure réelle avancera d'une minute !
