---
title: "Tiro di dadi in D&D"
description: "Lancia dei dadi e colpisci un goblin in un'avventura D&D."
en_md5: 627f6cce99fe83ecae4e1b53051201b9
---

Stai creando un bot in grado di giocare a Dungeons and Dragons (DnD). Se non conosci DnD, l'idea di base è che incontri molti scenari e lanci i dadi per determinare cosa succede. Ci sono molti dadi diversi con un diverso numero di facce (non solo il dado a sei facce a cui potresti essere abituato!)

Uno degli scenari che devi gestire è incontrare un goblin. Per attaccare il goblin devi:

- Genera un **punteggio di attacco** lanciando un dado a 20 facce.
- Genera un **punteggio di danno base** lanciando un dado a 12 facce.
- Genera un **punteggio di danno bonus** lanciando un dado a 10 facce.
- Somma il danno base e il danno bonus per ottenere il **danno totale**.
- Colpisci il goblin con il tuo tiro per attaccare e il danno totale.

Dopo ogni volta che lanci un dado, devi annunciare il numero che hai ottenuto alle altre persone con cui stai giocando. Se provi a colpire senza annunciare i numeri, potrebbero pensare che stai barando!

Hai a disposizione tre funzioni:

- `roll(sides)` (lanciare un dado) lancia un dado con il numero di facce dato. Questa funzione restituisce (_returns_ in inglese) il risultato.
- `announce(value)` (annunciare un valore) annuncia un lancio di dado.
- `strike(attack, damage)` (colpire con attacco e danno) colpisce il goblin con il tuo tiro per attaccare e il danno totale.

**Importante:** Ogni volta che chiami `roll()`, Jiki lancia un dado e ottiene un numero diverso. Non aspettarti che lanciando due volte lo stesso dado si ottenga lo stesso numero ogni volta.
