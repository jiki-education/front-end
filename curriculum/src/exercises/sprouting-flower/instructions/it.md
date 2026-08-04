---
title: "Fiore che germoglia"
description: "Usa le relazioni tra variabili per animare un fiore che cresce dal terreno."
en_md5: acd8f364af4cfdc8f76ced2b17539bbb
---

Il tuo compito è creare un fiore che cresca nell'arco di `60` iterazioni.

L'animazione dovrebbe apparire più o meno così.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Riquadri che mostrano un fiore che cresce dal terreno nell'arco di 60 iterazioni" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

La chiave di questo esercizio sta nel costruire relazioni tra i vari elementi. Si tratta di un'abilità fondamentale nella programmazione.

**Prima di leggere il resto delle istruzioni**, prenditi qualche minuto per capire concettualmente come realizzarlo. Scrivi su un foglio i passi che pensi di dover seguire.

**Una volta trovata una soluzione** che ti soddisfi (o dopo esserti arreso), **scorri verso il basso** per vedere le istruzioni.

---

## Come risolverlo

L'elemento chiave di tutto questo è il centro del fiore. Tutto il resto può essere calcolato a partire da quel punto centrale. A ogni iterazione del ciclo, il punto centrale deve salire di `1` (prima di disegnare).

Ecco altre cose che devi sapere:

- L'angolo in alto a sinistra dell'area di disegno è `0,0`. L'angolo in basso a destra è `100,100`.
- Il raggio del fiore parte da `0`. Deve aumentare di `0.4` a ogni iterazione (prima di disegnare).
- Il raggio del pistillo (la parte gialla centrale del fiore) parte da `0`. Deve aumentare di `0.1` a ogni iterazione (prima di disegnare).
- Il gambo deve partire dal centro del fiore e arrivare fino al terreno.
- La larghezza del gambo è il 10% dell'altezza del gambo (quindi `stemHeight / 10` (altezza del gambo diviso 10)).
- Tutto è centrato sull'asse orizzontale.
- Le foglie aderiscono al gambo su entrambi i lati.
- Le foglie si trovano a metà dell'altezza del gambo.
- Il `radiusX` (raggio orizzontale) delle foglie è il 50% del raggio del fiore.
- Il `radiusY` (raggio verticale) delle foglie è il 20% del raggio del fiore.
- Il fiore può essere `"red"` o `"pink"`, a seconda dei tuoi gusti. Il pistillo (il centro del fiore) deve essere `"yellow"`. L'erba deve essere `"green"`. Lo sfondo deve essere `"skyblue"`.

È **essenziale** lavorare su una cosa alla volta:

- Inizia disegnando il fiore rosa e facendolo salire.
- Poi fallo crescere.
- Aggiungi il centro giallo più piccolo.
- Aggiungi il gambo.
- Aggiungi la foglia sinistra.
- Aggiungi la foglia destra.

Usa la barra di riproduzione per scorrere il codice e capire dove le cose non funzionano.

### È un esercizio difficile

È un esercizio impegnativo. Prenditela con calma. Se ti blocchi davvero, chiedi aiuto e ricordati di darci molte informazioni su cosa non funziona e perché pensi che sia così.

Usa il cursore (la barra di riproduzione in basso a sinistra) per controllare il valore delle tue variabili se non ti è chiaro cosa sta succedendo. Clicca sul piccolo pulsante di attivazione per vedere le informazioni su ogni riga.

Ricorda, l'apprendimento sta nella difficoltà. Ogni volta che sbagli qualcosa e lo risolvi, stai diventando un programmatore. Alla fine ti sembrerà facile. Continua così.
