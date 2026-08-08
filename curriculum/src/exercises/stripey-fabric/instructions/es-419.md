---
title: "Tela rayada"
description: "Teje un patrón de rayas eligiendo correctamente el color de cada una."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Estás diseñando un algoritmo para crear un rollo de tela rayada, que debe verse así:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Veinte rayas verticales: púrpura en cada extremo, con rayas verdes, azules y amarillas entre ellas" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

El patrón es una secuencia repetitiva de `"yellow"`, `"blue"`, `"yellow"`, `"green"`. La primera y la última raya son `"purple"`.

El lienzo sobre el que diseñas mide `100` de ancho y `100` de alto. Necesitas dibujar `20` rayas, cada una de `5` de ancho.

### Reglas del ejercicio

No puedes resolver este ejercicio simplemente escribiendo 20 instrucciones de rectángulo. ¡Tu código debe escalar a cualquier tamaño de tela! De hecho, ¡solo puedes usar la función `rectangle(...)` (que dibuja un rectángulo) una vez en tu código!

En su lugar, necesitas hacer un bucle y usar el residuo (de la división) (_remainder_ en inglés) y el operador (_operator_ en inglés) que vimos en la lección en video anterior. Piensa con cuidado en el orden de las instrucciones: esa es la clave para tener éxito en este ejercicio.

¡Tómate tu tiempo y diviértete!
