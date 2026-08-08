---
title: "Loopar i loopar"
description: "Att lägga en loop inuti en annan så att den inre loopen körs klart för varje steg i den yttre loopen, vilket är perfekt för rutnät."
en_md5: 4ca3e15c1737b6e8cf2f03a56d23a887
---

Säg att vi vill ha en rad med blommor. Då kan vi skriva något i den här stilen. Vi sätter en position, vi planterar en blomma, vi ökar positionen med 10, vi upprepar, och till slut har vi en fin, prydlig rad med blommor.

```javascript
let x = 10
repeat(5) {
  plant(x, 50, 10)
  x = x + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/single-row-flowers.webp"
  alt="Jiki vid en tavla med en enda prydlig rad blommor planterad nedanför"
  width="406"
  height="400"
/>

Men tänk om vi vill ha ett rutnät av blommor, med rader och kolumner? Kanske fyra rader med fem blommor i varje rad.

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/grid-question.webp"
  alt="Ett rutnät med fyra rader och fem kolumner av blommor, och Jiki som funderar på hur han ska rita det"
  width="383"
  height="400"
/>

Vi har en loop som ritar en rad med blommor. Hur kan du använda den för att rita fyra rader? Eller vad skulle vi kunna göra för att rita fyra rader?

Ett alternativ vore att helt enkelt kopiera och klistra in loopen fyra gånger och ändra positionen uppifrån för var och en. Och det skulle fungera. Det vore helt okej. Men det är repetitivt, och det finns ett bättre sätt. Vi vet ju att när kod är repetitiv kan vi använda en loop för att förenkla den.

Så här kan vi använda en loop inuti en annan loop. En loop för raderna och en för blommorna på varje rad. Nu börjar vi med att lägga en `repeat`-loop runt vår befintliga kod, så att du får en känsla för hur det fungerar. Och till att börja med upprepar vi bara en gång. Vi säger alltså åt Jiki att göra allt som står innanför de yttre klammerparenteserna (`{}`) en gång. Det ger precis samma effekt som att inte ha den yttre loopen alls. Vi säger åt Jiki att upprepa något en gång, vilket är samma sak som att be Jiki göra det utan `repeat`. Men det är så här den här koden fungerar. Det är helt giltig kod. Vi har en loop inuti en annan loop.

Vad händer då om vi ändrar den yttre loopen så att den upprepar två gånger? Jo, då kör Jiki hela det där ”`plant` (plantera) fem gånger” två gånger. Han planterar 10 blommor. Men alla blommorna hamnar på samma rad.

På samma sätt som vi behöver flytta positionen från vänster till höger en bit varje gång, behöver vi också flytta positionen i höjdled när vi har ritat klart en hel rad. Så hur gör vi det? Jo, vi kan lägga till en yttre variabel för positionen uppifrån, använda den i vår `plant`-funktion och sedan öka den med 10 efter varje rad.

Tänk igenom vad värdet är vid varje tillfälle. Positionen uppifrån börjar på 10. De första fem gångerna vi planterar ligger den kvar där. Positionen från vänster ökar. Sedan ökar vi positionen uppifrån med 10 till, och planterar fem blommor till lite längre ner. Vi sätter tillbaka positionen från vänster till 10 igen, och sedan ökar vi den igen varje gång.

Och nu kan vi säga att det här ska upprepas fyra gånger, och då får vi fyra rader med fem plantor.

```javascript
let y = 10
repeat(4) {
  let x = 10
  repeat(5) {
    plant(x, y, 10)
    x = x + 10
  }
  y = y + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/flower-grid-result.webp"
  alt="Det färdiga rutnätet med fyra rader och fem kolumner av blommor, och en glad Jiki som gör tummen upp med båda händerna"
  width="389"
  height="400"
/>

Det viktiga att förstå är att Jiki gör klart allt arbete i den inre loopen (_inner loop_ på engelska) innan han går tillbaka till den yttre loopen (_outer loop_ på engelska). Han studsar inte fram och tillbaka. Han gör klart den inre loopen, och sedan går han vidare till nästa steg i den yttre loopen.

I den här situationen kan du tänka på den yttre loopen som den som styr grupperna, eller raderna, och den inre loopen som den som styr varje sak i gruppen, eller varje sak på raden. I vårt exempel gör den yttre loopen alltså fyra rader, och den inre loopen sätter fem plantor, fem saker, i varje grupp.
