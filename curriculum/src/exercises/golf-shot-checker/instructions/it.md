---
title: "Controllo del tiro"
description: "Scopri se un tiro da golf è atterrato abbastanza vicino per imbucare."
en_md5: 0585e8c489eca5a11da4df955e647456
---

Bentornato al campo da golf. Finora hai fatto rotolare la palla solo in orizzontale. Quando arrivava alla buca, restava semplicemente sopra di essa. Ora la animeremo davvero facendola scendere nella buca.

Il primo cambiamento è che la funzione `moveTo` (vai a) ora ha input per `x` (coordinata orizzontale) e `y` (coordinata verticale). Proprio come prima devi farla rotolare un passo alla volta, non semplicemente farla arrivare di colpo alla fine. Ma questa volta, se il giocatore riesce a mandare la palla in buca, devi animare anche quella parte finale, facendo scendere la palla nella buca dopo che ha raggiunto il punto giusto.

Poi, infine, **se la palla è atterrata in buca**, una volta rotolata fino in fondo, è il momento di festeggiare, quindi spara alcuni fuochi d’artificio usando la funzione `fireFireworks()` (spara fuochi d’artificio).

Ecco alcune cose da sapere:

1. La palla parte dal tee alle coordinate `x = 28`, `y = 75`, e rotola un passo alla volta.
2. Un tiro andato a segno significa che la lunghezza del tiro è `58`, `59`, `60`, `61` o `62`.
3. Devi far rotolare la palla verso il basso di `9` unità.

In questo esercizio, cerca di riflettere su ogni passaggio con attenzione e procedi un passo alla volta. Buona fortuna!
