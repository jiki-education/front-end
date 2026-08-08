---
title: "Strings"
description: "Stukjes tekst tussen aanhalingstekens (een letter, een woord, een zin of een hele alinea) die Jiki op papier schrijft."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Als je een getal wilt gebruiken, kun je dat getal gewoon opschrijven en weet Jiki wat je bedoelt. Maar wat als je een letter, een woord of een zin wilt gebruiken? Stel bijvoorbeeld dat de functie `rectangle` (rechthoek) of de functie `circle` (cirkel) een extra invoer had waarin je de kleur opgeeft. Hoe schrijven we die kleur op om die in de machine te stoppen? Als we gewoon het woord `green` (groen) of `blue` (blauw) schrijven, denkt Jiki dat we een machine op de planken bedoelen, en zegt hij: “Er is geen machine die green heet. Ik weet niet wat ik moet doen.”

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki staat verward naast de rectangle-machine, met vraagtekens boven zijn hoofd"
  width="446"
  height="400"
/>

Daarom hebben we een regel: als we tekst willen gebruiken, zetten we die tussen aanhalingstekens, en wel dubbele aanhalingstekens. En als je iets zo tussen aanhalingstekens zet, pakt Jiki een stuk papier en schrijft hij alles wat tussen die aanhalingstekens staat op dat stuk papier. Deze stukken papier noemen we _strings_ (_tekenreeksen_).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki schrijft het woord green op een stuk papier, dat een string wordt"
  width="398"
  height="400"
/>

Strings kunnen losse letters zijn, maar ook woorden, zinnen, alinea's, zelfs hele boeken. De regel is: is het tekst, dan zetten we het tussen aanhalingstekens en wordt het een string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Een whiteboard met strings van verschillende lengtes tussen aanhalingstekens: een losse letter, een woord, een zin en een adres van meerdere regels"
  width="500"
  height="398"
/>

Willen we dus een blauwe rechthoek, dan schrijven we het getal voor de linkerpositie, de bovenpositie, de breedte en de hoogte. Maar voor de vijfde invoer schrijven we `"blue"` tussen aanhalingstekens.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki pakt de machine van de plank en stopt munten in de eerste vier gleuven. Daarna schrijft hij blue op een stuk papier, stopt hij dat papier in de vijfde gleuf en zet hij de machine aan.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki stopt het papier met blue in de vijfde gleuf van de rectangle-machine, met munten van 10, 20, 30 en 40 in de eerste vier gleuven"
  width="500"
  height="392"
/>

Strings is zo'n technisch woord dat mensen in het begin wat afschrikt, maar eigenlijk betekent het gewoon tekst. Je raakt er heel snel aan gewend. Er is niets magisch aan.
