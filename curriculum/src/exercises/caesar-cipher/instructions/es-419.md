---
title: "Cifrado César"
description: "Cifra un mensaje secreto usando un antiguo cifrado romano."
en_md5: 029bbd7050127405f5e67a3a20353139
---

El cifrado César es una de las técnicas de cifrado más antiguas y sencillas. Lo usaba Julio César para enviar mensajes secretos a sus generales.

El cifrado funciona desplazando cada letra del mensaje un número fijo de posiciones en el alfabeto. Por ejemplo, con un desplazamiento de 3, 'a' se convierte en 'd', 'b' en 'e', y así sucesivamente. Si el desplazamiento pasa de la 'z', vuelve al principio del alfabeto.

Los espacios se deben conservar como espacios (no se desplazan).

Crea una función llamada `encode(message, shift)` (codificar(mensaje, desplazamiento)) que reciba un mensaje en minúsculas y un valor de desplazamiento, y devuelva el mensaje cifrado.

Por ejemplo:

- `encode("abc", 1)` devuelve `"bcd"`
- `encode("xyz", 3)` devuelve `"abc"` (da la vuelta)
- `encode("hello world", 5)` devuelve `"mjqqt btwqi"`

Pista: ¡conviene dividir este problema en funciones auxiliares más pequeñas!

### Dato curioso

Una vez fui maestro de ceremonias en una conferencia de tecnología en Braga, Portugal. Cinco minutos antes de salir al escenario, los organizadores se me acercaron y, algo avergonzados, me preguntaron si no me importaría disfrazarme de Julio César durante la primera parte del día para celebrar el legado romano de Braga. ¿Lo logré…?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="Jeremy disfrazado de César"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
