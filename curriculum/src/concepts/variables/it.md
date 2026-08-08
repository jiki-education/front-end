---
title: "Creare e usare le variabili"
description: "Scatole sugli scaffali di Jiki che conservano un valore con un'etichetta, così puoi recuperarlo più avanti nel tuo codice."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Le variabili sono ciò che ci permette di memorizzare informazioni. Quando programmiamo, spesso abbiamo bisogno di conservare un numero o una stringa da usare più avanti, e le variabili sono il modo in cui lo facciamo. Facciamo un passo indietro nel magazzino di Jiki: vedrai che ha un altro gruppo di scaffali. Conosciamo già il primo gruppo, quello con sopra le funzioni, quelle piccole macchine, come `move` e `rectangle`. Su questo secondo gruppo di scaffali, invece delle macchine, ci sono tante scatole: queste scatole sono le variabili. Puoi dire a Jiki di conservare qualsiasi cosa in queste scatole, e più tardi chiedergli di recuperarla. Ogni scatola ha un nome, proprio come le funzioni, e contiene una sola cosa: per ora un numero o una stringa. Più avanti nel corso vedremo come usarle per memorizzare dati più complessi.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Due gruppi di scaffali nel magazzino di Jiki: uno etichettato funzioni con dentro le macchine, uno etichettato variabili con dentro le scatole"
  width="500"
  height="173"
/>

Allora, come diciamo a Jiki di creare una scatola e metterci qualcosa dentro? Usiamo la parola chiave `let` ("sia", come in "sia x uguale a 10"). La parola chiave `let` dice a Jiki che deve creare una nuova scatola. Puoi immaginarlo mentre toglie una scatola di cartone dal suo imballaggio, la monta, e poi guarda cosa viene dopo la parola `let`: quella è l'etichetta che mette sulla scatola, in questo caso `name` (nome). Così prende la sua penna e scrive `name` sull'etichetta. Poi guarda cosa viene dopo il segno di uguale (_equal sign_ in inglese). In questo caso è il mio nome, `"Jeremy"`, e siccome `"Jeremy"` è una stringa, prende un pezzo di carta e ci scrive sopra `"Jeremy"`. È solo una stringa, esattamente come i colori con cui hai lavorato finora, e poi mette quel pezzo di carta dentro la scatola.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki che tiene in mano un pezzo di carta con scritta sopra la stringa Jeremy, pronto a metterlo nella scatola"
  width="373"
  height="400"
/>

Gli abbiamo detto di creare una scatola, metterci un'etichetta e infilarci qualcosa dentro, e ora lui va a mettere la scatola sullo scaffale. Poi, in qualsiasi altro momento del tuo programma, Jiki può andare a prendere quella scatola dallo scaffale e guardare cosa c'è dentro. Inizia a costruirti questo modello mentale. Io programmo da una vita, e ancora oggi quando scrivo codice immagino di mettere qualcosa in una scatola per poi tirarla fuori più tardi. Quando vedi la parola chiave `let`, pensa davvero: «Ok, vuol dire che sto creando una nuova scatola.»

Due parole sui nomi delle variabili, le etichette su queste scatole. Abbiamo alcune regole al riguardo. Primo: i nomi delle variabili non possono contenere spazi. Se vuoi usare più parole per l'etichetta di una scatola, attacchiamo le parole una all'altra e trasformiamo la prima lettera di ogni parola in maiuscola. Questo stile si chiama camel case: immagina le gobbe di un cammello che spingono in alto la prima lettera di ogni nuova parola fino a farla diventare maiuscola. Quindi, se vuoi un'etichetta con il mio nome, invece di scrivere due parole separate da uno spazio, scriviamo tutto come una parola sola con la N maiuscola: `myName`.

Inoltre, ogni nome di variabile deve essere unico. Non puoi avere due scatole con la stessa etichetta, e le variabili non possono nemmeno avere lo stesso nome di una funzione. Se te ne dimentichi, Jiki si confonderà e ti darà un messaggio di errore.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki che guarda confuso due scatole che hanno entrambe l'etichetta name"
  width="485"
  height="400"
/>

Vediamo ora dove potrebbe servirci una variabile. Supponiamo di voler disegnare un sole nel cielo. Sappiamo di poter usare la funzione `circle` (cerchio) dandole quattro input: `left` (sinistra), `top` (alto), `radius` (raggio) e `color` (colore). Ma man mano che disegniamo tante cose e tutti questi numeri si sparpagliano nel codice, diventa davvero difficile tenerne traccia e leggere il programma. Invece, possiamo creare una variabile per ciascun valore: `left`, `top`, `radius` e `color`, e poi fare riferimento a queste variabili più avanti. Il nostro obiettivo finale è poter usare la funzione `circle` specificando nomi di scatole chiari e leggibili: quando Jiki vedrà quei nomi, saprà di dover prendere le scatole dagli scaffali e usare quello che c'è dentro.

Creiamo quindi queste variabili. Iniziamo con la posizione da sinistra del sole. Usiamo la parola chiave `let` per dire a Jiki di creare una nuova scatola chiamata `leftPosition` (posizione da sinistra). Nota il camel case, con la P maiuscola. Poi diciamo a Jiki quale numero va nella scatola. Lui la mette sugli scaffali e passa a fare lo stesso per `topPosition` (posizione dall'alto), `radius` e `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Scatole etichettate sugli scaffali delle variabili, ognuna con dentro un valore che Jiki andrà a prendere più tardi"
  width="500"
  height="378"
/>

In qualsiasi momento nel nostro codice possiamo fare riferimento a queste variabili, e Jiki tirerà fuori i valori e li metterà in una macchina. L'altra cosa fantastica delle variabili è che, ogni volta che vogliamo disegnare qualcosa nella stessa posizione del sole, possiamo riutilizzare le stesse variabili `leftPosition` e `topPosition`. Prendiamo un esempio diverso. Immagina di costruire un muro di 30 mattoni, e vuoi che tutti i mattoni abbiano la stessa larghezza e la stessa altezza. È molto meglio creare all'inizio del codice le variabili per la larghezza e l'altezza, e poi fare riferimento a quelle nel resto del codice. Perché se poi vuoi cambiare la larghezza o l'altezza, ti basta cambiarla in un punto solo, e tutto il resto si aggiornerà.
