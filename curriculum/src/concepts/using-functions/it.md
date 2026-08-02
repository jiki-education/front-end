---
title: "Usare le funzioni"
description: "Dire a Jiki di avviare una delle sue piccole macchine scrivendo il suo nome seguito da due parentesi."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Quando scrivi codice, quello che stai facendo in realtà è comunicare ciò che vuoi che accada, in un linguaggio che il computer capisce. Esistono tantissimi linguaggi di programmazione diversi, e tantissimi interpreti diversi che prendono quello che scrivi e lo trasformano nel codice binario che il computer riesce a capire. In questo corso ti accompagna Jiki. L'intero corso prende il suo nome: Jiki sarà il tuo amico in questo viaggio nella programmazione. Il suo compito è interpretare il codice che scrivi e convertirlo nelle sequenze di 0 e 1 su cui il computer può davvero agire.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, l'interprete amichevole che ti accompagnerà in questo corso"
  width="421"
  height="400"
/>

Il senso della programmazione è dare all'interprete, in questo caso Jiki, le istruzioni giuste. E le istruzioni che puoi dare a Jiki sono tantissime, ne capisce moltissime. Sa attaccare le cose tra loro, sa fare una cosa molte volte, sa dire: «Se succede questo, allora devo fare quest'altro». Sa ricordare le cose e riutilizzarle più tardi. E se qualcosa non va, sa segnalarti un errore. Nel corso vedremo tutte queste cose. Ma la cosa fondamentale da capire è che tutto quello che farai consiste nello scrivere istruzioni su una lavagna, che Jiki poi arriva a leggere e segue.

Quando ho imparato a programmare, 34 anni fa, il modello mentale che mi sono costruito è questo, ed è lo stesso che ho ancora oggi. Capisco come funziona un computer fino al livello degli 0 e 1, ma sinceramente non ci penso mai. Nella mia testa, dentro il computer vive un omino in miniatura, e io gli dico cosa fare. Quindi seguimi su questa strada. È un modello mentale potente, che puoi costruirti anche tu, e se inizi a pensare in modo così visivo a quello che sta facendo la persona dentro il computer, ti sarà davvero molto utile mentre impari a programmare.

Allora iniziamo da uno dei concetti fondamentali della programmazione: le funzioni. Le funzioni sono come piccole macchine che puoi chiedere a Jiki di usare. E se diamo un'occhiata al magazzino di Jiki, il posto dove passa il suo tempo, vedrai che ha uno scaffale con tre macchine diverse sopra: `move` (muoviti), `turnLeft` (gira a sinistra) e `turnRight` (gira a destra).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Uno scaffale nel magazzino di Jiki con tre macchine chiamate move, turnLeft e turnRight"
  width="500"
  height="371"
/>

Quando hai scritto `move` e poi quelle due parentesi, quello che hai fatto è stato dire a Jiki di andare a prendere la macchina `move` dallo scaffale, di girare la manovella, di caricarla e di usarla.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki porta giù dallo scaffale la macchina move per usarla"
  width="439"
  height="400"
/>

Quando hai scritto `turnLeft` e poi le parentesi, hai detto a Jiki di prendere la macchina `turnLeft` dallo scaffale e di usarla. Ed è questo lo schema che userai di continuo: ogni volta che vuoi usare una macchina, scrivi il suo nome e poi quelle parentesi, e così dici a Jiki di andare a prendere la macchina e di usarla:

```javascript
move()
turnLeft()
```

Come funziona davvero quella macchina, cosa succede al suo interno, per ora non è importante. Lo vedremo molto più in dettaglio più avanti. Anzi, tra non molto sarai in grado di costruire le tue macchine. Ma per ora non preoccuparti. In ogni esercizio ti verrà detto quali macchine ci sono sullo scaffale di Jiki. Saranno diverse per ogni esercizio, e potrai usarle per risolvere gli esercizi.
