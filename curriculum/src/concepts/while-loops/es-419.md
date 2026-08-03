---
title: "Bucles `while`"
description: "Un bucle que se ejecuta mientras una condición siga siendo verdadera."
en_md5: daef89c6551b1d1cbc0e58668fd368bc
---

El siguiente bucle que debes conocer es el bucle `while` (mientras).

Esto significa: «Mientras se cumpla una condición, ejecuta el bucle». Así que podríamos tener una regla que diga que solo puedes disparar cinco veces en Space Invaders. Entonces tendríamos un bucle que diga: mientras el número de disparos sea menor que cinco, ejecuta un bucle que permita jugar.

```javascript
while (numShots < 5) {
  // disparar a un alien
  numShots++
}
```

Cada vez que alguien dispara, aumentamos `numShots` en uno, y al final llegamos a cinco y el bucle termina.

Ahora, un problema con los bucles `while` es que es muy fácil tener errores que hagan que el bucle nunca termine. Estos se llaman bucles infinitos (_infinite loops_ en inglés), y son uno de los errores más comunes en los programas.

Cuando tu computadora se pone lenta, los ventiladores empiezan a girar, todo se vuelve ruidoso, a menudo es porque alguien dejó un bucle infinito que nunca termina en su código.
