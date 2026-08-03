---
title: "HSL-färger"
description: "Bygg färger av färgton (nyansen, 0–360), mättnad (hur intensiv, 0–100) och ljushet (hur ljus, 0–100)."
en_md5: d751e07ccf6b5a58a11d3d2af1026b93
---

HSL ger oss ett helt annat sätt att tänka på färger än RGB. HSL står för färgton (_hue (H)_ på engelska), mättnad (_saturation (S)_ på engelska) och ljushet (_lightness (L)_ på engelska). Du har en funktion som heter `hsl` som tar tre tal, ett för färgton, ett för mättnad och ett för ljushet, och den returnerar en färg. Så nu ska vi titta närmare på vad de tre orden betyder.

```javascript
hsl(hue, saturation, lightness)
```

Färgtonen är den nyans av färg du vill ha, och den går från noll upp till 360. Tänk dig en regnbåge. Så här tänker jag på det. Längst till vänster har vi rött, och sedan kommer orange, gult, grönt, blått, lila, och till slut är vi faktiskt tillbaka på rött igen. Så om du säger noll börjar du till vänster, och det är rött. Om du säger `120` ber du om grönt. `230` är blått. Du kan också tänka dig det som en färgcirkel, och det är det som talet 360 egentligen handlar om. Det är antalet grader i cirkeln. Själv slår jag alltid upp de tal jag vill ha, så oroa dig inte för mycket för att försöka memorera det här, men det är bra att veta vad som händer. Så det är färgtonen, alltså nyansen. Sedan har vi mättnaden, som är hur intensiv färgen är. Den går från noll till 100. Vid noll får du bara grått. Det finns ingen färg, ingen ton alls där. Vid 100 får du full, intensiv, levande färg. Och så har vi ljusheten. Ljusheten är hur ljus färgen är, och den går också från noll till 100. Vid noll får du svart. Oavsett vilken färgton du har valt får du svart. Det finns inget ljus i den. Och vid 100 får du vitt. Oavsett allt annat är den helt full av ljus, så den blir vit. 50 är precis i mitten, den normala färgen. Så du kan tänka dig det här som ett reglage som gör färgen ljusare eller mörkare.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="En färgcirkel och en regnbåge som visar att 0 är rött, 120 är grönt och 240 är blått"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="Ett mättnadsreglage från 0 (grått) via 50 till 100 (full, intensiv färg)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="Ett ljushetsreglage från 0 (svart) via 50 till 100 (vitt)"
  width="500"
  height="398"
/>

Så om vi vill ha en vanlig röd cirkel, som vi hade skrivit som 255, noll, noll med RGB, allt det röda, inget grönt, inget blått, använder vi här noll, 100, 50. Noll för den röda färgtonen, 100 för mättnaden, full färg, och 50 för ljusheten, vilket är en normal ljusnivå. Om vi vill göra den till en grön cirkel kan vi bara ändra färgtonen till `120`. Om vi vill ha en mörkare grön kan vi sänka ljusheten till `25`.

```javascript
hsl(0, 100, 50) // röd
hsl(120, 100, 50) // grön
hsl(120, 100, 25) // mörkgrön
```

Om vi vill ha en mattare grön kan vi ta bort lite av färgen, lite av mättnaden, och sänka den till säg `30`.

Om du vill ha en riktigt klar, knallrosa färg är en färgton på ungefär 300 rosa. Sedan höjer vi mättnaden till 100 för att göra den riktigt intensiv, och vi ökar ljusheten också, till ungefär 60.

HSL är perfekt när du vill stega igenom färgerna. Om du vill ha en regnbåge kan du bara fortsätta öka färgtonen.
