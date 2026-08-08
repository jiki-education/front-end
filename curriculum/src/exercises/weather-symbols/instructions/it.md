---
title: "Simboli meteo"
description: "Disegna le previsioni meteo di sei giorni a partire da un array di descrizioni."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Ti è stato chiesto di preparare le previsioni meteo per sei giorni. Però, invece di ricevere i classici dati meteorologici, il tuo capo ti dà delle descrizioni del meteo basate su come il meteo lo fa sentire (ad esempio "Snowboarding time! 🏂" oppure "Miserable 😩").

Ti viene dato un array (una sequenza ordinata di valori) con sei descrizioni del meteo, una per giorno. Il tuo compito è disegnare il meteo di ogni giorno nel suo riquadro.

Le previsioni sono mostrate come una griglia di sei riquadri, uno per ogni giorno della settimana dal lunedì al sabato. Le descrizioni seguono lo stesso ordine: la prima (riquadro `0`) è il meteo di lunedì, la seconda (riquadro `1`) quello di martedì, e così via fino a sabato (riquadro `5`). (La domenica il tuo capo non esce di casa, quindi del meteo non si preoccupa, e noi non possiamo mai riportarlo...)

## Disegnare un giorno

Ti abbiamo dato una funzione `draw` (disegna) che fa tutto il lavoro artistico per te. Il tuo compito è capire quali elementi metterci dentro.

```js
draw(box, day, elements)
```

- `box` è il riquadro in cui disegnare (da `0` a `5`).
- `day` è il giorno della settimana con cui etichettare il riquadro, ad esempio `"Monday"`.
- `elements` è un array di simboli meteo da mostrare (vedi sotto per i dettagli).

I giorni della settimana, in ordine, sono `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` e `"Saturday"`.

Quindi, se il primo giorno è `"Exciting 🤩"`, scriverai:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Cosa significa ogni descrizione

Ogni descrizione corrisponde a un array preciso di simboli:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Il tuo compito

Scorri l'array `days` un giorno alla volta. Per ogni descrizione, trasformala nell'array di simboli giusto e disegnala con `draw` nel riquadro di quel giorno, etichettato con il giorno della settimana corrispondente.
