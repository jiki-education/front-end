---
title: "Balle à état"
description: "Fais rouler une balle de golf jusque dans le trou en suivant sa position."
en_md5: e3c9b61e57c7e245a7c4624433879471
---

On retrouve l'univers du jeu de golf, mais cette fois, ce qu'on construit a changé.

À la place de la fonction `roll()` (_rouler_) qu'on avait avant, on dispose maintenant d'une fonction `moveTo(position)` (_déplacer à la position_) qui déplace la balle instantanément à un endroit donné.

Quand le joueur frappe la balle, on pourrait la déplacer directement à sa destination finale, mais la voir arriver sans animation n'a rien de satisfaisant. On va donc appeler `moveTo(position)` de nombreuses fois pour donner l'impression qu'elle roule.

La balle part de la position **28** et doit atteindre la position **88**.

Résous cet exercice en **5 lignes de code**. Bonne chance !
