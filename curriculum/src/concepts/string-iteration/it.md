---
title: "Scorrere le stringhe"
description: "Usare un ciclo `for of` per scorrere ciascuna lettera di una stringa, facendo qualcosa con ciascuna di esse a turno."
en_md5: 584ac0a187a9e5244b84f0fd417494f3
---

Puoi accedere a una singola lettera di una stringa usando le parentesi quadre. Ora vediamo come scorrere una stringa, estraendo ciascuna lettera una alla volta.

E per farlo, abbiamo bisogno di un nuovo tipo di ciclo. Finora abbiamo usato il ciclo repeat, e ora useremo qualcosa chiamato ciclo `for of` (che scorre ogni elemento di una collezione uno alla volta). Sono due nuove parole chiave, `for` e `of`.

La parola chiave `for` è una di quelle che incontreremo in diversi posti man mano che andiamo avanti. Può stare da sola, oppure può essere abbinata a `in` o `of`. Per ora, concentriamoci su quest'ultima, `of`.

Allora diamo un'occhiata a un po' di codice.

Cominciamo creando una variabile chiamata `name` (nome) contenente la stringa `"Jeremy"` (il nome Jeremy). Niente di nuovo qui.

```javascript
let name = "Jeremy"
for (let letter of name) {
  // ...
}
```

Poi abbiamo la riga del ciclo, e lì succedono molte cose, quindi parliamone con calma.

Innanzitutto, abbiamo la parola chiave `for`. Questa dice a Jiki che vogliamo fare un ciclo. Allora lui guarda avanti e vede `of`, e capisce che vogliamo fare un ciclo `for of`.

E questo significa che invece di usare un ciclo repeat in cui diciamo «Ripetiamo 10 volte», diciamo «Scorriamo tutte le lettere della stringa». Questo è ciò che significa `for of`.

Poi abbiamo questa parte `let letter` (lettera). È esattamente la stessa cosa che abbiamo sopra con `let name`. Stiamo solo creando una variabile chiamata `letter`.

La differenza è che invece di essere espliciti sul contenuto, stiamo dicendo a Jiki di metterci dentro ciascuna lettera della stringa, una alla volta.

Allora Jiki vede `for`, controlla se c'è `of`, poi parte. Guarda la prima lettera della stringa, `"J"` in questo caso, e la mette in una nuova scatola chiamata `letter`. A proposito, potevamo chiamarla in qualsiasi altro modo. Non doveva essere per forza `letter`. Abbiamo solo deciso di chiamarla `letter` qui.

Poi esegue il codice all'interno delle parentesi graffe, e qui puoi fare qualsiasi cosa faresti in qualsiasi altro punto del codice. L'unica differenza è che questo blocco di codice verrà eseguito una volta per ogni lettera della stringa, e avrà a disposizione questa variabile.

Ogni volta che Jiki arriva alla parentesi graffa di chiusura, butta via la scatola `letter` e ne crea una nuova con la lettera successiva dentro. Quindi la prima volta butterà via la `"J"` e metterà invece una `"e"` nella scatola. Poi farà lo stesso per `"r"`, poi per `"e"`, poi per `"m"`, poi per `"y"`. Sei lettere, sei giri del ciclo. Ci vuole un po' di tempo per abituarsi alla sintassi, ma in realtà non è un concetto così difficile.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-iteration/jiki-letter-box-loop.webp"
  alt="Jiki butta via la vecchia scatola della lettera e infila la lettera successiva in una scatola nuova etichettata 'letter', ripetendo per ogni lettera della stringa"
  width="500"
  height="168"
/>
