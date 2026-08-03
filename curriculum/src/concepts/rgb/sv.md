---
title: "RGB-färger"
description: "Blanda rött, grönt och blått ljus från 0 till 255 för att skapa vilken färg du vill på skärmen."
en_md5: 8ed038f6d17072b6fb6eaae6bef15c2c
---

RGB låter oss tänka på färger som en blandning av rött, grönt och blått. Det är det RGB står för: röd (_red (R)_ på engelska), grön (_green (G)_ på engelska), blå (_blue (B)_ på engelska). Om du minns hur du blandade målarfärger i skolan är det en liknande idé, fast i stället för målarfärg blandar vi ljus.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Tre överlappande cirklar med rött, grönt och blått ljus som blandas till gult, magenta, cyan och vitt"
  width="500"
  height="390"
/>

I många övningar kommer du att ha en funktion som heter `rgb(red, green, blue)`. Den tar tre tal som indata, ett för rött, ett för grönt och ett för blått, och returnerar en färg.

Talen du kan använda som indata går från noll till `255`. Noll betyder att jag inte vill ha något av den färgen alls, och `255` betyder blanda i så mycket av färgen som möjligt. Så om vi använder `rgb`-funktionen med `255`, noll och noll som indata säger vi: jag vill ha allt det röda. Kom ihåg att `255` är det största talet du kan skriva in där. Men vi vill inte ha något grönt eller blått, så de är båda noll. Då får vi ut rött, och vi kan spara det röda i en variabel och sedan använda den i `circle`-funktionen, precis som vi redan har gjort med de namngivna strängarna. Så vad händer om vi använder `rgb`-funktionen med noll, `255`, noll? Nu säger vi: inget rött, allt det gröna, inget blått. Då får vi en grön cirkel. Och om vi vill ha gult då? Gult är en blandning av rött och grönt. Så vi kan säga: ge mig allt det röda, allt det gröna och inget blått, och då får vi gult. Vi kan också använda mindre tal. Om vi vill ha lite rött, inget grönt och mycket blått får vi lila. Och mycket rött, lite grönt och lite mer blått ger oss rosa. Så det är RGB. Vi blandar rött, grönt och blått för att få olika kombinationer.

```javascript
rgb(255, 0, 0) // rött
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="En röd cirkel skapad av rgb(255, 0, 0), allt rött och inget grönt eller blått"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0) // gult
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="En gul cirkel skapad av rgb(255, 255, 0), allt rött och allt grönt men inget blått"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170) // rosa
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="En rosa cirkel skapad av rgb(230, 50, 170), mycket rött, lite grönt och en del blått"
  width="436"
  height="400"
/>

RGB är praktiskt när du vill justera en specifik del: hur mycket rött, hur mycket grönt, hur mycket blått.
