---
title: "Triangolo"
description: "Classifica un triangolo come equilatero, isoscele o scaleno."
en_md5: 15574e7bfbdfaffbd935bf6bba258e63
---

Il tuo compito è creare una funzione che verifichi se un triangolo è equilatero, isoscele, scaleno o non valido.

### Triangoli

- Un triangolo _equilatero_ ha tutti e tre i lati della stessa lunghezza.
- Un triangolo _isoscele_ ha due lati della stessa lunghezza.
- Un triangolo _scaleno_ ha tutti i lati di lunghezze diverse.

Perché un triangolo sia valido:

- Tutti i lati devono essere maggiori di 0.
- Se sommi due lati qualsiasi, la somma deve essere maggiore del terzo lato.

### La funzione

La funzione deve chiamarsi `determineTriangleType` (determina il tipo di triangolo). Deve ricevere tre input: i numeri che rappresentano i tre lati del triangolo. Deve restituire uno tra `"invalid"`, `"equilateral"`, `"isosceles"` e `"scalene"`.
