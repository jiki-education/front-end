---
title: "Methodic Pangram"
description: "Actualiza tu Pangram para usar métodos integrados de strings."
en_md5: 61b73caa0318f68e9a0facca189e7abf
---

Te damos la bienvenida al tercer ejercicio de Pangram. En este vamos a tomar todas esas funciones auxiliares que creaste y simplificarlo todo muchísimo.

Cada una de las funciones que te animé a escribir (`includes`, `indexOf` y `toLowerCase`) en realidad ya vienen integradas en los strings como un método.

Así que, en lugar de escribir `includes("Jeremy", "r")`, puedes escribir `"Jeremy".includes("r")` y hace exactamente lo mismo. Pero como este método ya viene integrado en el string, ¡no tienes que escribirlo tú!

Para este ejercicio, solo necesitas dos de ellos:

- `"Jeremy".toLowerCase()`
- `"Jeremy".includes("r")`

Ya no necesitarás `indexOf` para nada: solo lo escribiste para ayudarte a construir `toLowerCase`, y ahora el `toLowerCase` integrado hace ese trabajo por ti.

Así que puedes eliminar todas esas funciones que escribiste (pero al menos ahora ya sabes cómo funcionan realmente estos métodos por dentro, ¡así que no me grites mucho!) y usar estos en su lugar.

¡Diviértete!
