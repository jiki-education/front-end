---
title: "Operatore modulo"
description: "Usare l'operatore `%` per ottenere il resto di una divisione, spesso usato per verificare se un numero è pari o dispari."
en_md5: fe49222bd3f3a019dd9f74a960c5dede
---

Finora abbiamo usato addizione, sottrazione, moltiplicazione e divisione per fare calcoli. Ora ne introduciamo un altro, l'operatore modulo.

L'operatore modulo ti dà il resto della divisione tra due numeri, e lo scriviamo con il simbolo percentuale. Quindi se scriviamo:

```javascript
10 % 4 // 2
```

stiamo dicendo, o chiedendo: «Cosa rimane quando dividiamo 10 per 4?» E la risposta è due. Immagina di avere 10 caramelle o noccioline e di volerle dividere in parti uguali tra quattro persone. Ciascuna riceve due, e alla fine ne rimangono due. Quel che rimane è il resto, ed è proprio quello che ti dà il simbolo percentuale.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="Una fila di dieci caramelle distribuite equamente fra quattro persone, con due di resto"
  width="500"
  height="22"
/>

Uno dei motivi per cui lo usiamo spesso nel codice è che ci permette di sapere se un numero è divisibile esattamente oppure no, e il caso più comune che vedrai è capire se un numero è pari o dispari. I numeri pari, come sai, sono tutti divisibili per due. I numeri dispari hanno sempre il resto di uno quando li dividi per due.

Quindi se prendi quattro, sei o otto, dividendoli per due, non hanno alcun resto, mentre cinque, sette e nove, dividendoli per due, hanno sempre uno di resto alla fine. Quindi scrivendo `if qualcosa % 2 === 0`, stiamo dicendo: «Questo qualcosa è un numero pari?» E questo può essere utile per un sacco di cose. Immagina di creare strisce di colori diversi o di dividere una fila a metà, mandando ogni persona in una delle due direzioni mentre cammina verso di te.

Una cosa da notare: potresti sentire chiamare questo operatore anche «operatore resto» (dall'inglese remainder). Modulo e resto sono praticamente identici. Ci sono alcune lievi differenze di cui probabilmente non dovrai mai preoccuparti, quindi per ora lo considereremo l'operatore modulo, che è molto più semplice.
