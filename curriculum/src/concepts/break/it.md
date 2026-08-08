---
title: "Break"
description: "Utilizzare la parola chiave `break` all'interno del corpo di un ciclo per uscire immediatamente dal ciclo e passare al codice che segue."
en_md5: 30148766de67ae467ab1a4852ad35895
---

La parola chiave `break` può essere usata in qualsiasi punto del corpo di un ciclo.

La parte tra le parentesi graffe, quello è il corpo. E quando Jiki lo vede, esce immediatamente dal ciclo e passa al codice che si trova sotto il ciclo.

Quindi, se abbiamo un vincolo che dice di eseguire questo ciclo 50 volte, ma vogliamo fermarci se l'utente spara cinque volte, potremmo avere un ciclo `for` all'inizio che conta fino a 50.

Ma poi potremmo avere una condizione al centro del ciclo che controlla se l'utente ha sparato cinque volte, e se sì, usiamo `break` (che fa uscire dal ciclo) per fermarlo.

```javascript
for (let i = 0; i < 50; i++) {
  if (numShots >= 5) {
    break; // esci dal ciclo
  }
}
```
