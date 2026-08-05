---
title: "Portatessere"
description: "Trova esattamente dove si trova una lettera sul portatessere."
en_md5: 156e18323706fc278f7a887f421c01f3
---

Stai costruendo un bot automatico per Scrabble. Il bot ha un portatessere con le tessere di lettere rappresentato come una stringa (ad esempio `"AERHBT"`). Quando il bot decide quale lettera giocare, deve sapere in quale posizione spostare la mano per prendere la tessera.

Scrivi una funzione chiamata `findTile` (trova la tessera) che prende il portatessere (una stringa di lettere) e la lettera da trovare. Se la tessera viene trovata, restituisci `"Move to position X"` dove X è la posizione della prima tessera corrispondente (a partire da 1). Se la tessera non è nel portatessere, restituisci `"Error: Tile not on rack"`.

Per costruire la stringa risultante, dovrai convertire il numero della posizione in una stringa e unire le parti usando la concatenazione (`+`) o una stringa interpolata.

Esempi:

- `findTile("ABCDE", "A")` restituisce `"Move to position 1"`
- `findTile("ABCDE", "C")` restituisce `"Move to position 3"`
- `findTile("BANANA", "A")` restituisce `"Move to position 2"` (la prima A)
- `findTile("ABCDE", "Z")` restituisce `"Error: Tile not on rack"`
