---
title: "Búsqueda de fichas"
description: "Buscar una letra específica en un atril de fichas."
en_md5: bbbc77ef2c270fd4228d6a20e690a095
---

Estás construyendo un bot de Scrabble. Antes de que el bot intente jugar una palabra, necesita verificar si tiene una ficha de una letra específica en su atril.

El atril se representa como un string de letras (por ejemplo, `"SCRAB"`).

Escribe una función llamada `contains` (contiene) que reciba dos argumentos:

- `haystack` (pajar): el atril de fichas, como un string
- `needle` (aguja): la letra a buscar

Devuelve `true` si la letra está en el atril, o `false` si no lo está.

Ejemplos:

- `contains("SCRAB", "A")` devuelve `true`
- `contains("SCRAB", "Z")` devuelve `false`
- `contains("", "A")` devuelve `false`
