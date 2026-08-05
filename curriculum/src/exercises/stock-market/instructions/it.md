---
title: "Mercato azionario"
description: "Tieni traccia del tuo investimento mentre il mercato azionario sale e scende casualmente."
en_md5: 233edb21475a3846a567f3bdda98ce84
---

Il primo gennaio di quest'anno hai investito 10 dollari guadagnati con fatica nel mercato azionario. Hai deciso di tenerlo nascosto alla tua famiglia e di rivelarlo solo dopo 20 anni, quando (si spera!) avrà guadagnato molto valore.

Ci sono tre cose da sapere sui mercati azionari:

1. Sono imprevedibili. Possono crescere o diminuire ogni anno. In media tendono a crescere circa del 10%, ma possono variare notevolmente.
2. Man mano che il mercato cresce, anche i tuoi soldi aumentano, e lo fanno ancora più velocemente grazie all'interesse composto. Se quest'anno investi 10 dollari e il mercato azionario raddoppia di valore nei prossimi 10 anni, avrai 20 dollari. Se raddoppia ancora nei 10 anni successivi, avrai 40 dollari (20 dollari \* 2, non 10 dollari \* 2!)
3. Quando ottieni dei profitti, devi dichiararli al fisco!

### Come funziona l'esercizio

Hai una funzione chiamata `marketGrowth(year)` che restituisce un numero che indica di quanto è cresciuto il mercato azionario quell'anno (ad esempio `5` significa che è cresciuto del `5%`). Quindi, se investi 10 dollari e il mercato cresce del 5%, ora hai $10.50.

Il tuo compito è tenere traccia di quanti soldi hai ogni anno e comunicarlo al fisco usando `reportTax(year, balance)`. Poi, dopo 20 anni, annuncia alla tua famiglia l'importo finale usando `announceToFamily(value)`. Il primo anno di `marketGrowth(...)` dovrebbe essere l'anno corrente.

Controlla le funzioni qui sotto per maggiori dettagli e, se rimani bloccato, puoi sempre consultare i suggerimenti!
