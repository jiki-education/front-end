---
title: "Compter les mots"
description: "Compte combien de fois chaque mot apparaît dans une phrase."
en_md5: f9b46f800337d7fff2aab88b6e368e3d
---

Tu enseignes l'anglais comme langue étrangère à des lycéens. Tu as décidé de construire tout ton programme autour de séries télé, et tu as donc besoin d'analyser quels mots sont utilisés et à quelle fréquence ils reviennent.

Ta tâche consiste à compter combien de fois chaque mot apparaît dans un sous-titre de série dramatique. Les sous-titres utilisent uniquement des caractères ASCII.

Les personnages parlent souvent un anglais familier, avec des contractions comme _they're_ ou _it's_. Même si une contraction vient de deux mots, elle est considérée comme un seul mot.

Les mots peuvent être séparés par n'importe quel signe de ponctuation (par exemple « : », « ! » ou « ? ») ou par des espaces. Le seul signe de ponctuation qui ne sépare pas les mots est l'apostrophe des contractions.

Les nombres sont considérés comme des mots. Si les sous-titres disent « It costs 100 dollars », alors « 100 » sera un mot à part entière.

Les mots sont insensibles à la casse. Par exemple, le mot « you » apparaît trois fois dans : « You come back, you hear me? DO YOU HEAR ME? »

Crée une fonction appelée `countWords` (compter les mots) qui prend une phrase en entrée et renvoie un dictionnaire avec les mots comme clés et leurs fréquences comme valeurs.
