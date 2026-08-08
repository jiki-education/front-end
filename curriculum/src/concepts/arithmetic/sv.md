---
title: "Aritmetik"
description: "Kombinera variabler med matematik så att värden kan hänga ihop och bero på varandra genom addition, subtraktion, multiplikation och division."
en_md5: 7ce54754a3ca29896609a01a51b12377
---

Hittills när vi har skapat variabler har vi bara använt enkla värden; ett tal som `50` eller en sträng som `"yellow"`. Variabler blir mycket kraftfullare när vi kan använda dem i kombination med varandra. Då kan vi till exempel säga att rektangelns vänstra kant ska vara på ett visst avstånd från canvasens kant.

I programmering kan vi använda vanlig, enkel matematik, sådant som att addera, subtrahera, multiplicera och dividera, och vi kan använda variablerna vi redan har satt som en del av det.

Vi börjar med att säga att vi vill rita en rektangel på vår canvas, och att den ska börja 10 in från vänster och från höger, och 20 in från toppen och botten. Den kommer alltså att hamna mitt på canvasen, lite bredare än vad den är hög.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="En blå rektangel mitt på canvasen, 10 in från vänster och höger och 20 in från toppen och botten"
  width="399"
  height="400"
/>

När vi ritar en rektangel behöver vi känna till dess `left` (vänsterkant), `top` (överkant), `width` (bredd) och `height` (höjd), och dessutom dess färg. Så vi kan börja med att skriva ut det.

Och nu behöver vi faktiskt räkna ut vad dess `left`, `top`, `width` och `height` ska vara. Så nu sätter vi dem. `Left` är 10. `Top` är 20. Och `width`, ja, `width` är canvasens storlek, som är 100, minus de 10 till vänster och de 10 till höger, alltså 80. Och `height` är canvasens höjd, som också är 100, minus de 20 överst och de 20 nederst, alltså 60.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

Så vi kan sätta de här variablerna. `Left`, 10, `top`, 20, `width`, 80, `height`, 60. Men vad händer nu om vi vill flytta in rektangeln en bit och göra den lite mindre? Om vi vill flytta den 20 från vänster och höger och 30 från toppen och botten? Då måste vi räkna ut allting igen. `width` är nu 100 minus 20 minus 20, och `height` är 100 minus 30 minus 30, och det här är definitivt mer jobb och mer matematik än jag vill göra. Så i stället kan vi säga åt datorn att göra det åt oss.

Vi kan sätta `width` till 100 minus `left` minus `left`, och `height` till 100 minus `top` minus `top`, eftersom det är samma sak upptill och nedtill. Eller så kan vi skriva det som 100 minus `left` gånger två, eller 100 minus `top` gånger två.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

Och om vi nu ändrar `left` eller `top` kommer `width` och `height` också att ändras. Sakerna börjar alltså hänga ihop med varandra. Och canvasen då? Den är 100 nu. Men tänk om vår canvas ändras till att vara 200 bred och hög i stället? Då borde vi nog skapa en variabel som heter `canvasSize` (canvasens storlek) och sätta den till 100. Och nu är vår `width` `canvasSize` minus `left` gånger två, och vår `height` är `canvasSize` minus `top` gånger två.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

Nu ska vi fundera på vad Jiki gör när vi skriver let `height` lika med `canvasSize` minus `top` gånger två. Jo, han börjar med att ta ner lådan `top` från hyllan, och i den hittar han 30. Så han tar fram sin miniräknare, räknar ut 30 gånger två och lägger 60 på minnet.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki tar ner lådan top från hyllan och räknar ut att 30 gånger två är 60"
  width="377"
  height="400"
/>

Sedan tar han ner lådan `canvasSize` från hyllan, hittar 100 i den och räknar ut att 100 minus 60 är 40. Och nu vet han att det vi egentligen säger är let `height` lika med 40. Så han gör som let säger: han hämtar en ny låda, skriver `height` på den och lägger sedan 40 i den. Och när han använder `height` senare tar han bara fram 40 igen.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki hämtar en ny låda, skriver height på den och lägger 40 i den"
  width="462"
  height="400"
/>

När du väl har fått allt att fungera i en övning, testa att ändra värdena på variablerna och se vad som händer. Se hur de växer och hur de krymper. Ta god tid på dig och fundera över hur sakerna hänger ihop med varandra.
