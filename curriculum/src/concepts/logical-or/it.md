---
title: "La parola chiave `or`"
description: "Combinare due condizioni con `||` in modo che l'intera condizione sia vera quando almeno una delle due parti è vera."
en_md5: 4c9ebc144707760d944e0cddfac5a561
---

Possiamo usare anche `or`, ma purtroppo in JavaScript non esiste una parola chiave comoda per `or`. Dobbiamo invece usare queste due barre (_bars_ in inglese) una accanto all'altra per indicare «or». Sembra strano, ma non lo è. Ti ci abituerai.

Quindi possiamo dire che se qualcuno ha più di 20 anni o è vestito in stile disco, allora può entrare. Così avremo una festa divertente con ragazzi vestiti in stile disco e adulti vestiti male, il che sembra ragionevole.

```javascript
if (age > 20 || outfit === "disco") {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-or/party-door.webp"
  alt="Jiki dà il benvenuto a un mix di ragazzi vestiti in stile disco e adulti vestiti in modo informale alla porta di una festa"
  width="327"
  height="400"
/>

C'è una cosa che crea confusione sia con `and` che con `or`, ed è che ogni lato dell'operatore `and`/`or` deve essere un confronto completo. Quindi anche se stai confrontando la stessa variabile su entrambi i lati, devi ripeterla. Non puoi scrivere `if age is less than 13 or greater than 20`. Devi scrivere `if age is less than 13 or age is greater than 20`. Hai bisogno che entrambi i lati siano confronti completi.

```javascript
if (age < 13 || age > 20)
```

Devi riflettere su quando entrambe le condizioni contano e quando solo una di esse deve essere vera.
