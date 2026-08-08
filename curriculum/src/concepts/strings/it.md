---
title: "Stringhe"
description: "Pezzi di testo racchiusi tra virgolette (una lettera, una parola, una frase o un intero paragrafo) che Jiki scrive su carta."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Quando vuoi usare un numero, ti basta scriverlo, e Jiki capisce cosa intendi. Ma se vuoi usare una lettera, una parola o una frase? Per esempio, con la funzione `rectangle` (rettangolo) o la funzione `circle` (cerchio), cosa succederebbe se ci fosse un input in più in cui specificare il colore? Come scriveremmo il colore da mettere nella macchina? Se scriviamo semplicemente la parola `green` (verde) o `blue` (blu), Jiki penserà che ci riferiamo a una macchina sugli scaffali, e dirà: "Non c'è nessuna macchina che si chiama green. Non so cosa fare."

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki in piedi, confuso, accanto alla macchina rectangle, con dei punti interrogativi sopra la testa"
  width="446"
  height="400"
/>

Quindi abbiamo una regola: ogni volta che dobbiamo usare del testo, dobbiamo metterlo tra virgolette, virgolette doppie. E quando metti qualcosa tra virgolette in questo modo, Jiki tira fuori un foglio di carta e ci scrive sopra quello che hai messo tra quelle virgolette. Questi fogli di carta li chiamiamo stringhe.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki scrive la parola green su un foglio di carta, che diventa una stringa"
  width="398"
  height="400"
/>

Le stringhe possono essere singole lettere, parole, frasi, paragrafi, perfino libri interi. La regola è questa: se è testo, lo mettiamo tra virgolette, e diventa una stringa.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Una lavagna che mostra stringhe di diversa lunghezza tra virgolette: una singola lettera, una parola, una frase e un indirizzo su più righe"
  width="500"
  height="398"
/>

Quindi, se vogliamo un rettangolo blu, scriviamo il numero per la sua posizione da sinistra, la sua posizione dall'alto, la sua larghezza e la sua altezza. Ma come quinto input scriveremo `"blue"` tra virgolette.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki prenderà la macchina dallo scaffale e metterà delle monete nelle prime quattro fessure. Poi scriverà blue su un foglio di carta, infilerà quel foglio nella quinta fessura e farà partire la macchina.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki infila il foglio con blue nella quinta fessura della macchina rectangle, con le monete 10, 20, 30, 40 nelle prime quattro fessure"
  width="500"
  height="392"
/>

Stringa è una di quelle parole tecniche che all'inizio possono intimidire un po', ma in realtà vuol dire semplicemente testo. Ti ci abituerai molto in fretta. Non c'è niente di magico.
