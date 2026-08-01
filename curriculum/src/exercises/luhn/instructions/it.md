---
title: "Luhn"
description: "Convalida numeri di identificazione come quelli delle carte di credito con la formula di Luhn."
en_md5: 07b0aea3adc2353e50a26e5cbe5cd162
---

Abbiamo appena visto come convalidare i codici ISBN dei libri. Esiste un'altra formula molto diffusa per controllare numeri in tanti contesti diversi: la formula di Luhn. È famosa soprattutto perché serve a individuare gli errori di battitura nei numeri delle carte di credito.

### Il controllo di Luhn

Il controllo di Luhn si svolge in vari passaggi:

- Partendo dalla cifra più **a destra** e procedendo verso sinistra, **raddoppia il valore di una cifra ogni due**.
- Se raddoppiando una cifra ottieni un numero maggiore di 9, sottrai 9 dal risultato.
- Poi somma tutte le cifre.
- Se il totale è esattamente divisibile per 10, il numero è valido.

Per esempio, con `"067"` seguiamo i passaggi:

```
0   6   7     // cifre originali
0  12   7     // una cifra ogni due (da destra) raddoppiata
0   3   7     // 12 è maggiore di 9, quindi sottraiamo 9 → 3
       10     // Sommiamo le cifre
     true     // 10 è divisibile per 10, quindi 067 è valido
```

### Il tuo compito

Crea una funzione chiamata `valid` (valido) che riceve una stringa e restituisce `true` se supera il controllo di Luhn e `false` in caso contrario.

I numeri vengono forniti come stringhe e possono contenere spazi per facilitarne la lettura (per esempio `"4539 1488 0343 6467"`). Gli spazi vanno ignorati.

Alcune note importanti:

- L'input può contenere spazi: ignorali.
- Se l'input contiene qualsiasi altro carattere, devi restituire false.
- Le stringhe di lunghezza 1 o inferiore (una volta rimossi gli spazi) **non** sono valide.

### Mettiamo in pratica quello che hai imparato.

Ci sono tanti modi per risolvere questo esercizio, ma la soluzione che ti chiediamo di trovare usa un ciclo `for`.

Ti servirà anche la funzione <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">`Number(str)`</a> che abbiamo introdotto nell'esercizio precedente.

Buon divertimento!
