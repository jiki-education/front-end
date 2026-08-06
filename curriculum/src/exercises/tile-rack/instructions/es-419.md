---
title: "Soporte de fichas"
description: "Encuentra exactamente dónde está una letra en el soporte de fichas."
en_md5: 156e18323706fc278f7a887f421c01f3
---

Estás armando un bot automático de Scrabble. El bot tiene un soporte de fichas con letras representado como un string (por ejemplo, `"AERHBT"`). Cuando el bot decide qué letra jugar, necesita saber hacia qué posición (_position_ en inglés) mover la mano para tomar la ficha.

Escribe una función llamada `findTile` (encontrarFicha) que recibe el soporte (un string de letras) y la letra a buscar. Si la ficha se encuentra, devuelve `"Move to position X"` donde X es la posición de la primera ficha que coincida (empezando desde 1). Si la ficha no está en el soporte, devuelve `"Error: Tile not on rack"`.

Para construir el string de resultado, necesitarás convertir el número de la posición a un string y combinar las partes usando concatenación (`+`) o un template string.

Ejemplos:

- `findTile("ABCDE", "A")` devuelve `"Move to position 1"`
- `findTile("ABCDE", "C")` devuelve `"Move to position 3"`
- `findTile("BANANA", "A")` devuelve `"Move to position 2"` (la primera A)
- `findTile("ABCDE", "Z")` devuelve `"Error: Tile not on rack"`
