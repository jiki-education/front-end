---
title: "Acrónimo"
description: "Convierte una frase en su acrónimo, ignorando la puntuación por el camino."
en_md5: 97e2adefc1da7867f5e218d0fe8c4fdb
---

Ya has resuelto acrónimos sencillos de tres letras, como convertir `Portable Network Graphics` en `PNG`.

Sin embargo, en este ejercicio vamos un paso más allá y tratamos con todos los acrónimos: no solo los de tres letras. Y esto es mucho más difícil...

Tu tarea es escribir una función llamada `acronym(phrase)` que reciba una frase y devuelva su acrónimo.

## Las reglas

Una nueva palabra comienza después de un **espacio** o un **guion** (`-`). Cualquier otro carácter (comas, apóstrofos, guiones bajos, signos de exclamación, etc.) **no** es un separador y nunca forma parte del acrónimo. Solo cuentan las letras.

| Frase                     | Acrónimo |
| ------------------------- | -------- |
| As Soon As Possible       | ASAP     |
| Liquid-crystal display    | LCD      |
| Thank George It's Friday! | TGIF     |

## Atención

No te hemos dado ninguno de los métodos avanzados de JavaScript que verás más adelante en el curso (nada que convierta mágicamente una letra en mayúscula ni que te diga si un carácter es una letra). Tendrás que construir todas esas funciones auxiliares tú mismo antes de poder armar todo.

Este ejercicio es más complicado de lo que parece. ¡Diviértete!
