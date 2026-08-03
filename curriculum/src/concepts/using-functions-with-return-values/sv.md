---
title: "Funktioner som returnerar saker"
description: "Fånga ett värde som kommer ut ur en funktions rutschkana och använd det i din kod."
en_md5: 5d8a17a37be570bc9c63df0c854ba774
---

Hittills har vi tittat på funktioner som gör något ute i världen. Funktionen circle ritar en cirkel, och funktionen move flyttar din figur. Men vissa funktioner fungerar annorlunda. I stället för att göra något utåt ger de dig något tillbaka som du kan använda i din kod. När en funktion ger något tillbaka som Jiki kan använda i koden säger vi att funktionen returnerar (_return_ på engelska) något. Den skickar alltså tillbaka något ut till Jiki. Du kan tänka dig att de här maskinerna har en rutschkana. Vi har redan våra inkast som vi lägger saker i, men en maskin kan också ha en enda utgång, en rutschkana som något kan komma tillbaka ut genom. När Jiki trycker på maskinens knapp surrar den igång, och till slut trillar något ut ur rutschkanan. Det kan vara ett tal. Det kan vara en sträng. Det är något som Jiki kan fånga och använda.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="En maskin med en rutschkana på sidan, redo att skicka tillbaka ett värde till Jiki"
  width="500"
  height="317"
/>

De flesta funktioner, kanske 95 procent av dem, returnerar något. De kanske räknar ut något åt dig och returnerar värdet, eller klistrar ihop några strängar och ger dig den färdiga strängen. Eller så ger de dig aktuell tid varje gång du kör den maskinen. Nu tittar vi närmare på det sista exemplet. Säg att vi har en funktion som heter `getCurrentTime` (hämta aktuell tid). Varje gång Jiki kör maskinen glider en lapp ut ur rutschkanan med tiden på, kanske 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="Maskinen getCurrentTime med en lapp där det står 14:35 på väg ut ur rutschkanan"
  width="500"
  height="312"
/>

Sedan kan vi lägga det returnerade värdet i en låda med `let`:

```javascript
let time = getCurrentTime()
```

Jiki kör maskinen, hämtar aktuell tid från rutschkanan och sparar den i en låda som heter `time`.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki lägger lappen med 14:35 från rutschkanan i en låda med etiketten time"
  width="372"
  height="400"
/>

Det är viktigt att förstå att lappen som Jiki lägger i lådan är låst till just det ögonblicket. Även om den faktiska tiden hinner ändras medan programmet kör, ligger det fortfarande kvar en lapp i lådan där det står 14:35. När något väl ligger i lådan är det något fast. Det ändras inte på magisk väg. Om vi vill lägga in den aktuella tiden i lådan igen längre fram behöver vi använda vår `getCurrentTime`-funktion en gång till för att hämta den.

De flesta funktioner som returnerar saker tar också emot indata. Vi kan till exempel ha en funktion som heter `join` (sammanfoga) som tar två strängar som indata och returnerar dem sammanfogade med ett mellanslag. Så om vi använder en `join`-maskin med `"Hello"` och `"World"` som indata kommer det ut en enda sträng ur rutschkanan, med `"Hello World"` skrivet på sig.

```javascript
join("Hello", "World"); // "Hello World"
```
