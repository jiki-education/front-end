---
title: "Semafori Relazionali"
description: "Ricostruisci il semaforo in modo che tutto si ridimensioni insieme."
en_md5: d54633094a8d14f73b298fe4827504c4
---

Eccoti di nuovo con i semafori! Questa volta seguiremo lo schema degli ultimi due esercizi e costruiremo i semafori in modo che, modificando il raggio, si ridimensionino correttamente. Per ottenere questo risultato abbiamo una serie di variabili che possiamo impostare in modo che dipendano da `center` e/o da `radius` (raggio).

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Semaforo di riferimento" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Come funziona

- L'angolo in alto a sinistra dell'area di disegno è `0,0`. L'angolo in basso a destra è `100,100`.
- Le variabili di colore e `center` sono già fissate per te. Il raggio (`radius`) è preimpostato a 10, ma puoi provare a cambiarlo.
- Devi derivare tutte le variabili di posizione e dimensione come una combinazione di `radius` e/o `center`.
- L'involucro è un rettangolo che circonda tutte e tre le luci con una spaziatura. La spaziatura è la stessa del raggio.
- Le tre luci sono distanziate in modo uniforme verticalmente all'interno dell'involucro, che si trova al centro dell'immagine. (Quindi il centro del cerchio giallo è il centro dell'immagine).

### Variabili da derivare

Tutte queste variabili devono usare `radius` o `center` (ad esempio una formula come `radius * 7` o `center - (radius * 2)`)

- `redY` (coordinata y del rosso), `yellowY` (coordinata y del giallo), `greenY` (coordinata y del verde): le coordinate verticali dei centri di ciascuna luce.
- `housingX` (coordinata x dell'involucro), `housingY` (coordinata y dell'involucro): l'angolo in alto a sinistra del rettangolo dell'involucro.
- `housingWidth` (larghezza dell'involucro), `housingHeight` (altezza dell'involucro): le dimensioni del rettangolo dell'involucro.

### Verifica la reattività

Mentre lavori, puoi cambiare il raggio da `2` a `12` per vedere se tutto si ridimensiona correttamente. Se il tuo codice è corretto, dovresti vedere ogni cosa scalare in modo ordinato attorno al centro dell'immagine!
