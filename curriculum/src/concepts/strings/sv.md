---
title: "Strängar"
description: "Textbitar inom citattecken (en bokstav, ett ord, en mening eller ett helt stycke) som Jiki skriver på papper."
en_md5: 89b04f3849f9388a46734924f35c913c
---

När du vill använda ett tal kan du helt enkelt skriva talet, så förstår Jiki vad du menar. Men hur gör du om du vill använda en bokstav, ett ord eller en mening? Tänk dig till exempel att funktionen `rectangle` (rektangel) eller funktionen `circle` (cirkel) hade ett extra inkast där du angav färgen. Hur skulle vi skriva färgen för att stoppa in den i maskinen? Om vi bara skriver ordet `green` (grön) eller `blue` (blå) tror Jiki att vi menar en maskin på hyllorna, och då säger han: ”Det finns ingen maskin som heter green. Jag vet inte vad jag ska göra.”

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki står förvirrad bredvid rectangle-maskinen med frågetecken över huvudet"
  width="446"
  height="400"
/>

Därför har vi en regel: när vi behöver använda text sätter vi den inom citattecken, dubbla citattecken. Och när du sätter något inom citattecken på det här sättet tar Jiki fram en lapp och skriver det som står mellan citattecknen på den lappen. De här lapparna kallar vi strängar (_strings_ på engelska).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki skriver ordet green på en lapp, som blir en sträng"
  width="398"
  height="400"
/>

Strängar kan vara enskilda bokstäver, ord, meningar, stycken, till och med hela böcker. Regeln är: om det är text sätter vi den inom citattecken, och då blir den en sträng.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="En tavla med strängar av olika längd inom citattecken: en enskild bokstav, ett ord, en mening och en adress på flera rader"
  width="500"
  height="398"
/>

Så om vi vill ha en blå rektangel skriver vi talen för dess vänsterposition, dess topposition, dess bredd och dess höjd. Men i det femte inkastet skriver vi `"blue"` inom citattecken.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki tar ner maskinen från hyllan och lägger mynt i de fyra första inkasten. Sedan skriver han blue på en lapp, stoppar lappen i det femte inkastet och kör igång maskinen.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki stoppar lappen med blue i det femte inkastet på rectangle-maskinen, med mynten 10, 20, 30 och 40 i de fyra första inkasten"
  width="500"
  height="392"
/>

Sträng är ett sånt där tekniskt ord som många tycker är lite skrämmande i början, men egentligen betyder det bara text. Du vänjer dig snabbt. Det är inget magiskt med det.
