---
title: "Casa strutturata"
description: "Guida il disegno completo di una casa partendo da due variabili di ancoraggio."
en_md5: 783a94e5de5f4bd22cd634e07eabc131
---

Il tuo compito è disegnare una casa, costruendo l'intera struttura a partire da due sole variabili di ancoraggio: `houseWidth` (larghezza della casa) e `houseHeight` (altezza della casa).

Abbiamo già preparato per te i colori, la larghezza dell'area di disegno e le due variabili di ancoraggio. Tutto il resto (la posizione della casa, il tetto, le finestre, la porta e la maniglia) deve essere ricavato dalle due ancore e dai dati fissi qui sotto.

**Pensa in termini di relazioni!** Se lo fai nel modo giusto, dovresti riuscire a cambiare solo `houseWidth` e `houseHeight` e la casa intera si ridimensionerà correttamente: rimarrà centrata orizzontalmente, ancorata al prato e manterrà le sue proporzioni. Non scrivere posizioni fisse che hai calcolato da solo. Costruisci ognuna a partire dalle ancore.

<img src="/static/images/exercise-assets/structured-house/structured-house-finished.webp" alt="La stessa casa disegnata con tre larghezze e altezze diverse: ognuna rimane centrata e ancorata al prato." style="width: 100%; box-sizing: border-box; padding: 16px; background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Specifiche della casa

- L'angolo in alto a sinistra dell'area di disegno è `0,0`. L'angolo in basso a destra è `100,100`.
- Il cielo riempie l'area di disegno (da `0,0` a `100,100`).
- L'erba è a tutta larghezza e si trova sul fondo dell'area di disegno con un'altezza di `15`.
- La casa è sempre centrata orizzontalmente sull'area di disegno.
- La base della casa si trova `5` sotto la cima dell'erba, e la casa si estende verso l'alto da lì.
- Il tetto poggia sopra la struttura della casa. Sporge lateralmente di `1/10` della larghezza della struttura su entrambi i lati, la sua altezza è `1/2` dell'altezza della struttura e la sua punta è centrata orizzontalmente.
- Ogni finestra è larga `1/5` della larghezza della struttura e alta `1/3` dell'altezza della struttura. Si trovano `1/8` dell'altezza della struttura sotto la parte superiore della struttura e sono rientrate di `1/7` della larghezza della struttura da ciascun lato.
- La porta è larga `1/5` della larghezza della struttura e alta `1/2` dell'altezza della struttura, centrata orizzontalmente, con la base in linea con la base della casa.
- Il raggio della maniglia è `1/10` della larghezza della porta. C'è uno spazio di `1/10` della larghezza della porta tra la maniglia e il bordo destro della porta. La maniglia è centrata verticalmente nella porta.

### Verifica che funzioni!

Prova a cambiare le variabili `houseWidth` e `houseHeight`. Se il tuo codice è corretto, la casa si ridimensionerà rimanendo centrata e ancorata al prato.
