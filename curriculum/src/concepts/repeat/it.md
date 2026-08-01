---
title: "Il ciclo repeat"
description: "Usare la parola chiave `repeat` per dire a Jiki di eseguire il codice tra le parentesi graffe un certo numero di volte."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Finora abbiamo scritto tutto in modo lineare: Jiki segue ogni istruzione in ordine, dall'alto verso il basso.

Ora vediamo come Jiki può uscire da questo rigido flusso dall'alto verso il basso, e in particolare come possiamo dirgli di eseguire la stessa sezione di codice tante volte di fila.

Per esempio, immagina di essere nel labirinto e di voler avanzare di 10 passi. C'è una funzione `walk` che ti aiuta a farlo, ma se non esistesse? Se avessi solo la funzione `move` (avanza)?

Invece di scrivere `move` 10 volte di fila, cosa che diventa molto ripetitiva, quello che ci serve è poter dire: "Ehi, Jiki, fai 10 volte la prossima cosa che dico.

`Move`."

Per farlo nel codice, dobbiamo usare la nostra prima parola chiave (_keyword_ in inglese). Le parole chiave sono istruzioni che Jiki capisce. Assomigliano un po' alle macchine, ma non lo sono. Quando Jiki vede una parola chiave, non cerca una macchina sullo scaffale: sa già cosa fare. È una cosa incorporata nel suo cervello. Durante il corso impareremo circa 20 parole chiave diverse, e la prima è la parola chiave `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki circondato da parole chiave come repeat, if, else, and, or, con la nota che le parole chiave sono istruzioni che Jiki capisce"
  width="358"
  height="400"
/>

La parola chiave `repeat` fa esattamente quello che ho detto sopra. Dice a Jiki: "Ripeti questo numero di volte qualunque cosa io dica dopo." Dai un'occhiata a questo codice. Per prima cosa usiamo la parola chiave `repeat` per dire a Jiki che dovrà fare qualcosa più volte. Tra parentesi tonde indichiamo quante volte vogliamo che Jiki ripeta la cosa. Seguono poi le parentesi graffe: dentro di esse mettiamo le cose che vogliamo che Jiki ripeta. Questo schema è incredibilmente comune nella programmazione. Scriviamo una parola chiave, di solito con qualche informazione, come in questo caso il numero di volte in cui fare qualcosa, e poi un blocco di codice tra parentesi graffe. Quindi, tornando al mondo del labirinto, invece di scrivere `move`, `move`, `move`, `move`, possiamo scrivere "ripeti quattro volte `move`".

```javascript
repeat(4) {
  move()
}
```

Jiki vedrà quel codice e userà la macchina `move` quattro volte di fila.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki che usa la macchina move quattro volte di fila, una dopo l'altra"
  width="421"
  height="400"
/>

E non siamo limitati a una sola cosa tra quelle parentesi graffe. Jiki può fare più cose ripetutamente. Possiamo dirgli di fare `move`, poi `turnLeft`, e di ripetere tutto questo quattro volte. Se Jiki vede questo codice, userà la macchina `move`, poi la macchina `turnLeft`, poi la macchina `move`, poi la macchina `turnLeft`, poi la macchina `move`, e così via, finché non le avrà usate entrambe quattro volte.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki che usa la macchina move e poi la macchina turnLeft, ripetendo la coppia di azioni quattro volte"
  width="500"
  height="390"
/>

Queste istruzioni di ripetizione si chiamano cicli (_loop_ in inglese), e ci sono tanti cicli diversi che possiamo usare, ognuno con un funzionamento un po' diverso.

C'è un'ultima cosa da sapere: quando lavori con i cicli, tenere il codice in ordine diventa essenziale. Quando il tuo codice ha una buona struttura visiva, è molto facile vedere cosa sta succedendo. Ma se non ce l'ha, se dimentichi di indentare bene o fai confusione con l'indentazione, le cose diventano confuse molto in fretta. Per questo nel corso abbiamo sempre una regola. Metti sempre la parentesi graffa di apertura sulla stessa riga dell'istruzione (_statement_ in inglese) `repeat`. Metti sempre la parentesi graffa di chiusura su una riga a sé dopo l'istruzione, e indenta sempre di due spazi il codice compreso tra queste graffe. Così tutto resterà davvero in ordine, e se te ne dimentichi o provi a seguire uno schema diverso, otterrai un errore.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki che indica l'indentazione e la nuova riga che tengono in ordine il blocco di codice di un ciclo"
  width="500"
  height="398"
/>
