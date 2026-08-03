---
title: "Símbolos meteorológicos"
description: "Dibuja un pronóstico del clima de seis días a partir de una lista de descripciones."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Te han pedido que hagas un pronóstico del clima para seis días. Sin embargo, en vez de recibir datos meteorológicos tradicionales, tu jefe te da descripciones del clima basadas en cómo se siente al respecto (por ejemplo, «Snowboarding time! 🏂» o «Miserable 😩»).

Recibes un Array (_arreglo_) de seis descripciones del clima, una por día, y tu tarea es dibujar el clima de cada día en su propia caja.

El pronóstico se muestra como una cuadrícula de seis cajas, una para cada día de la semana de lunes a sábado. Las descripciones van en orden: la primera (caja `0`) es el clima del lunes, la segunda (caja `1`) es el del martes, y así sucesivamente hasta el sábado (caja `5`). (Tu jefe no sale de casa los domingos, así que no le importa el clima de ese día, y por eso nunca lo podemos reportar...)

## Dibujar un día

Te hemos dado una función `draw` (dibujar) que se encarga de todo el arte por ti. Tu tarea es averiguar los elementos correctos que debes poner dentro.

```js
draw(box, day, elements)
```

- `box` es la caja en la que dibujar (de `0` a `5`).
- `day` es el día de la semana con el que etiquetar la caja, por ejemplo `"Monday"`.
- `elements` es un Array de símbolos meteorológicos para mostrar (consulta los detalles más abajo).

Los días de la semana, en orden, son `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` y `"Saturday"`.

Así que si el primer día es `"Exciting 🤩"`, escribirías:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Qué significa cada descripción

Cada descripción se corresponde con un Array específico de símbolos:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Tu tarea

Recorre la lista `days` un día a la vez. Para cada descripción, conviértela en la lista correcta de símbolos y dibújala con `draw` en la caja de ese día, etiquetada con el día de la semana correspondiente.
