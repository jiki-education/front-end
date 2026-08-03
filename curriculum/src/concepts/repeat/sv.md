---
title: "repeat-loopen"
description: "Med nyckelordet `repeat` säger du åt Jiki att köra koden mellan klammerparenteserna ett visst antal gånger."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Hittills har allt varit skrivet linjärt: Jiki följer varje instruktion i ordning, uppifrån och ner.

Nu ska vi titta på hur Jiki kan bryta det strikta flödet uppifrån och ner, och framför allt hur vi kan säga åt Jiki att köra samma kodavsnitt många gånger i rad.

Tänk dig till exempel att du är i labyrinten och vill gå 10 steg framåt. Det finns en funktion som heter `walk` som hjälper till med det, men tänk om den inte fanns? Tänk om du bara hade funktionen `move` (flytta)?

I stället för att skriva `move` 10 gånger i rad, vilket blir väldigt enformigt, behöver vi kunna säga: ”Du Jiki, gör det jag säger härnäst 10 gånger.

`Move`.”

För att göra det i kod behöver vi använda vårt första nyckelord (_keyword_ på engelska), och nyckelord är instruktioner som Jiki förstår. De ser lite ut som maskiner, men det är de inte. När Jiki ser ett nyckelord letar han inte efter någon maskin på hyllan, han vet direkt vad han ska göra i stället. Det sitter i hans hjärna. Det finns ungefär 20 olika nyckelord som vi kommer att lära oss under kursen, och det första av dem är nyckelordet `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki omgiven av nyckelord som repeat, if, else, and och or, med en notis om att nyckelord är instruktioner som Jiki förstår"
  width="358"
  height="400"
/>

Nyckelordet `repeat` gör precis det jag beskrev ovan. Det säger åt Jiki: ”Upprepa det jag säger härnäst så här många gånger.” Titta på den här koden. Först använder vi nyckelordet `repeat` för att tala om för Jiki att han ska göra något flera gånger. Sedan skriver vi hur många gånger vi vill att Jiki ska upprepa saken mellan vanliga parenteser, och sedan har vi de här klammerparenteserna (`{}`), och mellan dem står det som vi vill att Jiki ska upprepa. Det här mönstret är otroligt vanligt i programmering. Vi skriver ett nyckelord, oftast med lite information (i det här fallet hur många gånger något ska göras), och sedan ett kodblock (_code block_ på engelska) mellan klammerparenteser. Så om vi går tillbaka till labyrintvärlden kan vi, i stället för att skriva `move`, `move`, `move`, `move`, skriva att `move` ska upprepas fyra gånger.

```javascript
repeat(4) {
  move()
}
```

Jiki ser koden och använder maskinen `move` fyra gånger i rad.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki använder maskinen move fyra gånger i rad, direkt efter varandra"
  width="421"
  height="400"
/>

Och vi är inte begränsade till en enda sak mellan klammerparenteserna. Jiki kan göra flera saker om och om igen. Vi kan säga åt Jiki att köra `move`, sedan `turnLeft`, och att upprepa alltihop fyra gånger. Om Jiki ser det här använder han maskinen `move`, sedan maskinen `turnLeft`, sedan maskinen `move`, sedan maskinen `turnLeft`, sedan maskinen `move`, och så vidare, tills han har gjort båda fyra gånger.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki använder maskinen move och sedan maskinen turnLeft, och upprepar de två stegen fyra gånger"
  width="500"
  height="390"
/>

De här upprepningsinstruktionerna kallar vi loopar, och det finns många olika loopar vi kan använda, som alla fungerar lite olika.

En sak till är bra att veta: när du jobbar med loopar blir det helt nödvändigt att hålla koden snygg och prydlig. När koden har en bra visuell struktur är det väldigt lätt att se vad som händer. Men om den inte har det, om du glömmer att göra fina indrag eller blandar ihop dina indrag, blir det rörigt väldigt fort. Därför har vi alltid en regel i den här kursen. Du sätter alltid den inledande klammerparentesen på samma rad som `repeat`-satsen (_statement_ på engelska). Du sätter alltid den avslutande klammerparentesen på en egen rad efter satsen, och du gör alltid ett indrag på två mellanslag för koden däremellan. Då håller sig allt riktigt prydligt, och om du glömmer det eller försöker följa ett annat mönster får du ett fel.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki pekar på indraget och den nya raden som håller loopens kodblock prydligt"
  width="500"
  height="398"
/>
