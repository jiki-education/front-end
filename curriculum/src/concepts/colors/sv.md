---
title: "Färger"
description: "Två sätt att ange precis vilken färg du vill. RGB blandar rött, grönt och blått ljus. HSL använder färgton, mättnad och ljushet."
en_md5: a0eea0481b975e45f75774d83966a4a7
---

Om du någon gång gör något visuellt med kod (och även om du vill bli data scientist och tycker att allt det där med att rita verkar lite tråkigt, så är det en nyckelfärdighet att kunna kommunicera data visuellt) finns det två olika sätt att uttrycka färger på. Du har redan använt färger med namn som ”red” eller ”yellow” som sista indata i dina ritfunktioner, och det har varit ett smidigt sätt att snabbt använda färger, men det är ganska begränsande. Det finns bara en handfull namngivna färger vi kan använda. Så nu ska vi titta på två sätt att uttrycka precis vilken färg du vill, och de två kallas RGB och HSL.

RGB låter oss tänka på färger som en blandning av rött, grönt och blått. Det är det RGB står för: röd (_red (R)_ på engelska), grön (_green (G)_ på engelska), blå (_blue (B)_ på engelska). Om du minns hur du blandade färger i skolan är det en liknande idé, fast här blandar vi ljus i stället för färg.

I många övningar kommer du att ha en funktion som heter `rgb`. Den tar tre tal som indata, ett för rött, ett för grönt och ett för blått, och returnerar en färg.

Talen du kan använda som indata går från noll till `255`. Noll betyder ”jag vill inte ha något av den färgen alls”, och `255` betyder ”blanda i så mycket av den färgen som möjligt”. Så om vi använder `rgb`-funktionen med `255`, noll och noll som indata säger vi: jag vill ha allt det röda. Kom ihåg att `255` är det största talet du kan skriva in där. Men vi vill inte ha något grönt eller blått, så de är båda noll. Då får vi ut rött, och det röda kan vi lagra i en variabel och sedan använda i `circle`-funktionen, precis som vi redan har gjort med de namngivna strängarna. Så vad händer om vi använder `rgb`-funktionen med noll, `255`, noll? Nu säger vi: inget rött, allt det gröna, inget blått. Då får vi en grön cirkel. Och om vi vill ha gult? Gult är en blandning av rött och grönt. Så vi kan säga: ge mig allt det röda, allt det gröna och inget blått, och då får vi gult. Vi kan också använda mindre tal. Om vi vill ha lite rött, inget grönt och mycket blått får vi lila. Och mycket rött, lite grönt och lite mer blått ger oss rosa. Så det är RGB. Vi blandar rött, grönt och blått för att få olika kombinationer.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/rgb-intro.webp"
  alt="Tre överlappande cirklar av rött, grönt och blått ljus som blandas till gult, magenta, cyan och vitt"
  width="500"
  height="390"
/>

```javascript
let red = rgb(255, 0, 0)
let green = rgb(0, 255, 0)
let yellow = rgb(255, 255, 0)
let pink = rgb(230, 50, 170)
```

Nu ska vi titta på HSL, som ger oss ett helt annat sätt att tänka på färger. HSL står för färgton (_hue (H)_ på engelska), mättnad (_saturation (S)_ på engelska) och ljushet (_lightness (L)_ på engelska). Precis som med RGB har du en funktion som heter `hsl`. Den tar tre tal, ett för färgton, ett för mättnad och ett för ljushet, och returnerar en färg. Så nu går vi igenom vad de tre orden betyder.

Färgtonen är den nyans (_shade_ på engelska) av färg du vill ha, och den går från noll upp till 360. Tänk dig en regnbåge. Det är så här jag brukar tänka. Längst till vänster har vi rött, och sedan kommer orange, gult, grönt, blått, lila, och till slut är vi faktiskt tillbaka på rött igen. Så om du säger noll börjar du längst till vänster, och det är rött. Säger du `120` ber du om grönt. `230` är blått. Du kan också tänka på det som en färgcirkel (_color wheel_ på engelska), och det är det 360 egentligen handlar om. Det är antalet grader i cirkeln. Själv slår jag alltid upp de tal jag vill ha, så lägg inte för mycket energi på att memorera det här, men det är bra att veta vad som pågår. Så det är färgtonen, alltså nyansen. Sedan har vi mättnaden, som är hur kraftig färgen är. Den går från noll till 100. Vid noll får du bara grått. Det finns ingen färg, ingen ton alls. Vid 100 får du full, kraftig, levande färg. Och sedan har vi ljusheten. Ljusheten är hur ljus färgen är, och den går också från noll till 100. Vid noll får du svart. Oavsett vilken färgton du har valt får du svart. Det finns inget ljus i den. Och vid 100 får du vitt. Oavsett allt annat är den bara full av ljus, så den blir vit. 50 ligger precis i mitten, den normala färgen. Så du kan tänka på det här som ett reglage (_slider_ på engelska) som gör färgen ljusare eller mörkare.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/hsl-intro.webp"
  alt="En regnbåge och en färgcirkel som visar hur färgtonen går från 0 (röd) till 120 (grön) till 240 (blå)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/saturation-slider.webp"
  alt="Reglage för mättnad från 0 (grått) via 50 till 100 (klar magenta)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/lightness-slider.webp"
  alt="Reglage för ljushet från 0 (svart) via 50 (full färg) till 100 (vitt)"
  width="500"
  height="398"
/>

Så om vi vill ha en vanlig röd cirkel, som vi skulle ha skrivit som 255, noll, noll med RGB (allt det röda, inget grönt, inget blått), använder vi här noll, 100, 50. Noll för den röda färgtonen, 100 för mättnaden, full färg, och 50 för ljusheten, vilket är en normal nivå. Om vi vill göra den till en grön cirkel kan vi bara ändra färgtonen till `120`. Vill vi ha en mörkare grön kan vi sänka ljusheten till `25`.

Om vi vill göra den till en mattare grön kan vi ta bort lite av färgen, lite av mättnaden, säg ner till `30`.

Vill du ha en riktigt klar, skrikig rosa? En färgton på ungefär 300 är rosa, och sedan höjer vi mättnaden till 100 så att den blir riktigt kraftig, och vi ökar ljusheten också, till ungefär 60.

```javascript
let red = hsl(0, 100, 50)
let green = hsl(120, 100, 50)
let darkGreen = hsl(120, 100, 25)
let dullGreen = hsl(120, 30, 50)
let hotPink = hsl(300, 100, 60)
```

Så nu har vi två olika sätt att uttrycka färg, och de är användbara i olika situationer. RGB är toppen när du vill justera en specifik komponent: hur mycket rött, hur mycket grönt, hur mycket blått. HSL är toppen när du vill stega dig genom färgerna. Vill du ha en regnbåge kan du bara fortsätta öka färgtonen.
