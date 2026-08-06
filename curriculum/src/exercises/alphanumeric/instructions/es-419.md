---
title: "Alfanumérico"
description: "Crea funciones para clasificar texto como letras, números o ambos."
en_md5: 4a99adb1b883c6f6710a3494a8961cc2
---

En este ejercicio, tu tarea es crear funciones que verifiquen si un string contiene letras y/o números.

Necesitarás escribir tres funciones auxiliares:

- `isAlpha(string)` (es alfabética) — determina si un string solo contiene letras ASCII (por ejemplo, "A", "a", "Hello")
- `isNumeric(string)` (es numérica) — determina si un string solo contiene caracteres numéricos (por ejemplo, "0", "1", "456")
- `isAlphanumeric(string)` (es alfanumérica) — determina si un string solo contiene letras ASCII o números (por ejemplo, "Hello", "42", "Hello42")

Para cualquier otro símbolo (por ejemplo, "! ?") o caracteres no ASCII (por ejemplo, "じき", "正直"), las tres funciones deben devolver false.

Luego, escribe una función `whatAmI(string)` (qué soy) que use esos ayudantes para clasificar un string:

- Los strings que solo contienen letras deben devolver `"Alpha"`
- Los strings que solo contienen números deben devolver `"Numeric"`
- Los strings que contienen tanto letras como números deben devolver `"Alphanumeric"`
- Todo lo demás debe devolver `"Unknown"`

### Usa lo que acabas de aprender

Aunque hay muchas formas válidas de resolver este ejercicio, la solución que queremos que crees usa una sentencia `continue` y las tres funciones anteriores.

Este ejercicio también te reta a resolver todo en 42 líneas de código o menos. Ese objetivo no es necesariamente la solución de mayor calidad de producción. Un par de líneas adicionales probablemente den una más bonita, y también hay soluciones más cortas. Pero es una buena meta para ampliar tus capacidades.

¡Diviértete!
