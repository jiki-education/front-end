---
title: "Stringhe interpolate"
description: "Usare i backtick e i segnaposto `${...}` per inserire direttamente i valori in una stringa invece di unire pezzi con `+`."
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

Possiamo usare qualcosa che si chiama stringhe interpolate (_template literals_ in inglese) per inserire stringhe in altre stringhe.

Quindi, invece di unire stringhe tra loro, possiamo avere una stringa (o modello) che ha spazi per altre stringhe al suo interno.

Per farlo, usiamo i backtick invece delle virgolette.

I backtick sono apici inversi, come suggerisce il nome, ma è probabile che tu non li abbia mai usati prima, quindi devi trovare il tasto giusto sulla tastiera.

Li usiamo per creare un modello che può contenere altre stringhe. E poi, per inserire una stringa nel modello, usiamo un'altra strana sintassi fatta di dollari e parentesi graffe. Quindi, per esempio, per ottenere lo stesso effetto di `"hello " + name` che abbiamo appena visto con la concatenazione, potremmo scrivere:

```javascript
`hello ${name}` // "ciao Jeremy" o "ciao Jiki"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki che tiene in mano una scatola con l'etichetta 'nome', il valore che viene inserito nel modello"
  width="207"
  height="400"
/>

E questo fa esattamente la stessa cosa che unire le stringhe tra loro.

Ma quando hai più stringhe che devono essere inserite in un unico posto, questo metodo può essere molto più efficiente.

Ci vorrà un po' di tempo per abituarti a questa sintassi esatta, ma non c'è nulla di veramente complicato.
