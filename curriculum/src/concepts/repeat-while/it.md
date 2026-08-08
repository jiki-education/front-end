---
title: "Ripetere senza contare"
description: "Lasciare vuote le parentesi di un ciclo repeat in modo che Jiki continui finché qualcos'altro gli dice di fermarsi."
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

Fino ad ora, quando hai usato il ciclo repeat, hai sempre specificato un numero che indica quante volte ripetere. Ripeti cinque volte, 10 volte, 40 volte. A volte hai usato anche una variabile per farlo. Ma hai sempre detto a Jiki esattamente quante volte ripetere il ciclo. Tuttavia, a volte non sappiamo in anticipo quante volte ripetere. Pensa al labirinto. All'inizio del corso, hai risolto il labirinto scrivendo le mosse specifiche. Potevi vedere il labirinto, contare i passi e scrivere il numero giusto di mosse.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="Un labirinto in cui il personaggio può vedere il percorso, contare i passi e scrivere esattamente le mosse giuste"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

Ma se ti dicessi: «Scrivimi del codice che possa risolvere qualsiasi labirinto ti do»? Quel labirinto potrebbe richiedere 10 passi, o 50, o 200. Non ne hai idea in anticipo.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Diversi labirinti di forme e dimensioni variabili, con Jiki che cerca di capire come risolverli tutti"
  width="402"
  height="400"
/>

Quindi ti serve un modo per dire a Jiki di andare avanti. Continua a controllare da che parte puoi andare, continua a prendere decisioni, continua ad avanzare, ancora e ancora, finché non hai finito.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki che corre su un tapis roulant, continuando all'infinito"
  width="428"
  height="400"
/>

E il modo per farlo è molto semplice. Basta non dare un numero al comando `repeat`. Lascia semplicemente vuote quelle parentesi. Se lo fai, Jiki continuerà ad andare avanti finché qualcos'altro non gli dirà di fermarsi. Più avanti vedremo quali sono quei qualcos'altro. Ma per ora, continuerà ad andare avanti finché l'esercizio non sarà finito, o finché non deciderà che è passata un'eternità, che ha bisogno di una pausa e che ne ha abbastanza.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki accasciato esausto sul tapis roulant dopo aver corso per un'eternità, pronto a mollare e a fare una pausa"
  width="500"
  height="378"
/>
