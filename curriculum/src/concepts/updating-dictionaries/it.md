---
title: "Modificare i dizionari"
description: "Usare `dict[key] = value` per aggiornare voci esistenti o aggiungerne di nuove, e il metodo `has` per verificare le chiavi."
en_md5: 254912c3c672aec40b2729cd005fb1a7
---

Sai come creare un dizionario e ottenere valori al suo interno. Ma cosa succede se i dati cambiano? A un certo punto, invecchierò. Non avrò più `42`, ma `43`.

Come aggiorniamo il dizionario? Beh, usiamo un metodo molto simile a quello per trovare qualcosa. Sai che per ottenere un valore usiamo le parentesi quadre per estrarlo. Beh, possiamo anche usare le parentesi quadre seguite dal segno di uguale per aggiornare il dizionario. Jiki va alla scatola persona, tira fuori la pagina del taccuino, trova la chiave `"age"`, poi cancella il `42` che c'era e scrive `43` al suo posto, e infine la pagina del taccuino torna dentro la scatola. Questo modifica il dizionario stesso.

```javascript
person["age"] = 43
```

Jiki non sta creando un nuovo dizionario, sta modificando il taccuino che era già nella scatola.

E se vuoi aggiungere un'informazione che prima non c'era? Beh, puoi fare esattamente la stessa cosa.

Se specifichi una chiave che non esiste, Jiki aggiunge semplicemente una nuova chiave in fondo con quel valore.

Quindi, in questo caso, aprirà il taccuino, cercherà `"country"`, vedrà che non c'è, e poi aggiungerà una nuova riga in fondo, con `"country"` a sinistra e `"England"` a destra.

```javascript
person["country"] = "England"
```

Quindi esattamente la stessa sintassi di quando modifichi un valore. Jiki gestisce entrambe le cose automaticamente. Se la chiave esiste, la aggiorna. Se non esiste, la aggiunge. Non devi fare niente di speciale.

E proprio come puoi partire da un array vuoto e aggiungere elementi uno alla volta, puoi partire da un dizionario vuoto e aggiungere chiavi una per una. Anche questo è un pattern molto comune. Lo vedrai sempre.

Un uso comune dei dizionari è tenere il conto delle cose. Puoi specificare le chiavi come gli elementi di cui tenere il conto e i valori come i loro conteggi. Immagina di fare birdwatching e di voler tenere traccia di quanti uccelli di ogni tipo hai visto. Ogni volta che vedi un uccello, imposti il suo conteggio a uno, e poi ogni altra volta che lo vedi, prendi il suo valore attuale e lo incrementi di uno. Perché questo schema funzioni, abbiamo bisogno di un modo per verificare se il dizionario ha già quella chiave, nel qual caso aggiungiamo uno, oppure se non ha quella chiave, dobbiamo impostarla a uno.

E per farlo abbiamo un metodo sui dizionari: il metodo `has` (contiene).

Specifichi una chiave che ti interessa e Jiki verifica se il dizionario ha quella chiave o no, e restituisce `true` o `false` di conseguenza.

```javascript
person.has("age") // true
```

Mettendo tutto insieme, lo schema del conteggio è questo:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
