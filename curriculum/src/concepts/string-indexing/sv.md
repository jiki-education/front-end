---
title: "Indexering av strängar"
description: "Så använder du hakparenteser och ett positionsnummer för att plocka ut en enskild bokstav ur en sträng. Kom ihåg att positionerna börjar på noll."
en_md5: cd31e0366b3090b358494667003f54c9
---

Tänk dig att du har mitt namn, Jeremy, och vill plocka ut min initial J ur det. Hur skulle vi bära oss åt?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki funderar på hur han ska plocka ut en enskild bokstav ur en sträng"
  width="361"
  height="353"
/>

Du kan tänka på en sträng som en rad bokstäver. `"Jeremy"` har sex bokstäver, J-E-R-E-M-Y, och var och en har en position. `"J"` står på första positionen och `"y"` på den sista.

I JavaScript, och i de flesta programmeringsspråk, börjar de här positionerna på noll. Den första bokstaven `"J"` står alltså på position noll, sedan kommer `"e"` på position ett, `"r"` på två, `"e"` på tre, `"m"` på fyra och `"y"` på fem.

Det här med att börja på noll är ganska konstigt, och ärligt talat hade livet varit enklare om vi bara räknade från ett, som i den vanliga världen. Men det gör vi inte. I de flesta programmeringsspråk börjar vi räkna från noll i stället, så det är helt enkelt något du får lära dig.

Om vi vill hämta bokstaven på en viss position använder vi alltså hakparenteser (`[]`) med numret inuti.

Skriver vi `"Jeremy"[0]` säger vi: ge mig den första bokstaven i ordet `"Jeremy"`.

Skriver vi `"Jeremy"[1]` säger vi: ge mig den andra bokstaven.

```javascript
"Jeremy"[0] // "J"
"Jeremy"[1] // "e"
```

Det här fungerar med variabler också. Om vi skapar en variabel som heter `name` (namn) och sätter dess värde till strängen `"Jeremy"`, kan vi skriva `name[0]` och få `"J"` igen.

```javascript
let name = "Jeremy"
name[0] // "J"
```

En sak som är viktig att förstå: det du får tillbaka från `name[0]` är bara en annan sträng. Det är en annan lapp med ett J på. Det är inget speciellt med den. Den är en sträng precis som `"Jeremy"` är en sträng.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki håller i en ny lapp med bara bokstaven J på"
  width="500"
  height="289"
/>

Den råkar bara ha en bokstav på sig i stället för sex.

Och det här påverkar inte den ursprungliga strängen alls. Vi river liksom inte loss J:et eller något sådant. Vi tar bara reda på vilken bokstav vi vill ha och skapar en ny sträng med den i.
