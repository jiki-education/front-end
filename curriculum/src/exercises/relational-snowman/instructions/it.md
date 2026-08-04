---
title: "Pupazzo di neve relazionale"
description: "Ricostruisci il tuo pupazzo di neve in modo che tutte le dimensioni derivino da un'unica variabile."
en_md5: 1753f8d873e9a5b58885cc1daee5ea5d
---

In questo esercizio costruiamo un altro pupazzo di neve, ma come nell'esercizio precedente lo facciamo in modo che tutto possa essere ricavato da una singola variabile `size` (dimensione) usando l'aritmetica.

A seconda della `size` che scegli, il pupazzo di neve dovrebbe crescere.

<img
  src="/static/images/exercise-assets/relational-snowman/sizes.webp"
  alt="Pupazzo di neve alle dimensioni da 1 a 5"
  style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>

### Come funziona

- L'angolo in alto a sinistra dell'area di disegno è `0,0`. L'angolo in basso a destra è `100,100`.
- Hai una variabile già scritta `snowmanX` (coordinata X del centro dell'immagine) per il centro dell'immagine ed una variabile `size` che puoi cambiare da `1` a `5` per far crescere il pupazzo di neve.
- Devi ricavare tutte le altre variabili usando espressioni aritmetiche.
- Il raggio della testa è `size * 2`, il raggio del corpo è `size * 3` ed il raggio della base è `size * 4`.
- I cerchi devono toccarsi: il corpo si trova direttamente sopra la base e la testa si trova direttamente sopra il corpo. (Il nostro pupazzo di neve è un po' più instabile rispetto agli esercizi precedenti: ogni palla di neve è posizionata esattamente sopra quella sottostante senza che si fondano l'una nell'altra. Dev'essere una giornata molto gelida!)
- Il fondo del cerchio della base si trova a `size` dal bordo inferiore.
- Devi calcolare i centri di tutte e tre le palle di neve.

### Variabili

Il tuo compito è impostare queste variabili seguendo le istruzioni qui sopra.

- `headRadius` (raggio della testa): deriva da `size`
- `bodyRadius` (raggio del corpo): deriva da `size`
- `baseRadius` (raggio della base): deriva da `size`
- `baseY` (coordinata Y della base): deriva da `size` e `baseRadius` (la base poggia sul terreno)
- `bodyY` (coordinata Y del corpo): deriva da `baseY`, `baseRadius` e `bodyRadius`
- `headY` (coordinata Y della testa): deriva da `bodyY`, `bodyRadius` e `headRadius`

### Gioca con `size`

Puoi cambiare `size` da `1` a `5` ed il pupazzo di neve dovrebbe crescere. Ricorda di premere "Esegui il codice" dopo averlo cambiato.
