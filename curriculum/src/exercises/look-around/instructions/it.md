---
title: "Guardati intorno"
description: "Costruisci le funzioni che controllano cosa c'è intorno a te nel labirinto."
en_md5: 9ca44b407519cf6b3d5fa9f3f0e3b3d3
---

L'ultima volta hai aggiunto una nuova funzione per aiutare a navigare nel labirinto: `turnAround()` (girati). Abbiamo il tuo codice a sinistra perché tu possa continuare a lavorarci.

Questa volta abbiamo rimosso tre funzioni su cui facevi affidamento prima. Il tuo compito in questo esercizio è implementarle tu stesso!

### Le funzioni che devi scrivere

Le tre funzioni che devi creare sono `canTurnLeft()` (può girare a sinistra), `canTurnRight()` (può girare a destra) e `canMove()` (può muoversi).

Nessuna di queste funzioni ha input. Tutte devono restituire un valore booleano che indica se è possibile muoversi in quella direzione.

Per aiutarti, abbiamo aggiunto una nuova funzione `look(direction)` (guarda). Questa funzione prende un input: una direzione che può essere `"left"`, `"right"` o `"ahead"`. Restituisce uno tra:

- `"start"` (Il punto di partenza)
- `"target"` (La meta)
- `"empty"` (Via libera!)
- `"fire"` (Attenzione!)
- `"poop"` (Che schifo!)
- `"wall"` (Ahi!)

### Suggerimenti utili

Ecco tre consigli per aiutarti.

1. Una buona pratica in un esercizio come questo è **iniziare creando le funzioni** di cui il codice ha bisogno per funzionare (cioè `canTurnLeft()`, `canTurnRight()` e `canMove()`). Imposta i loro valori restituiti su un default sensato (in questo caso `true` o `false`). Successivamente puoi implementare la logica di ciascuna funzione e fare progressi ogni volta, invece di ricevere costantemente un errore che la funzione non esiste finché non hai scritto l'intero programma.
2. **Non dovresti aver bisogno di modificare il codice esistente** per questo esercizio. Aggiungi invece le tre funzioni all'inizio del codice.
3. Puoi scrivere **altre funzioni** oltre a quelle richieste, se ti può aiutare.
