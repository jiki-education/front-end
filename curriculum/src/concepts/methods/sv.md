---
title: "Metoder"
description: 'Funktioner som hör till ett värde och anropas med punktnotation, som `"Jeremy".includes("e")` eller `"Jeremy".toUpperCase()`.'
en_md5: 37c097a81459cd2ff4ae684559bd4311
---

Hittills har vi mest tänkt på strängar och tal som ganska statiska saker.

Och det är de, men de har också massor av inbyggd funktionalitet som Jiki kan använda.

Framöver ska vi lära oss mer om den här funktionaliteten, om de här förmågorna som de har och som gör livet mycket enklare för dig.

Det finns två typer av förmågor vi ska titta på: egenskaper (_properties_ på engelska) och metoder (_methods_ på engelska).

Metoder är funktioner som hör till strängen.

Så i stället för att vi skriver en funktion som vi stoppar in en sträng i som indata, kan vi använda en metod direkt på strängen.

Kommer du till exempel ihåg en funktion där du kollar om en sträng innehåller en viss bokstav? Strängar har faktiskt en metod som heter `includes` (innehåller) som gör just det, och vi kan använda den med samma punktsyntax som du såg för egenskaperna.

Skillnaden mot egenskaper är att när vi skriver metoder skriver vi dem som funktioner, med parenteser och indata.

Så vi kan skriva:

```javascript
"Jeremy".includes("e") // true
```

Då får vi tillbaka `true`, eftersom `"Jeremy"` har ett `"e"` i sig.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki skriver strängen Jeremy på en lapp"
  width="359"
  height="400"
/>

Metoder skiljer sig från egenskaper eftersom de inte är statiska fakta. De är faktiskt funktioner. Du kan tänka på dem som funktioner med en inbyggd låda där strängen ligger.

Hur de fungerar spelar ingen roll just nu. Du kommer inte att bygga egna på ett bra tag. Allt du behöver veta är att du använder en metod med en punkt följd av den vanliga funktionssyntaxen.

En sak att känna till med strängar är att metoderna inte ändrar något inuti strängen. Det finns till exempel en metod som heter `toUpperCase` (till versaler), som returnerar strängen med alla bokstäver som versaler. Men den ändrar inte den ursprungliga strängen. Den innehåller fortfarande `"Jeremy"`, skrivet med bara ett stort J. I stället skapar Jiki en ny sträng som är helt i versaler.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName) // "JEREMY"
log(name) // "Jeremy"
```
