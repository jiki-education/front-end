---
title: "`if`-satser"
description: "Använd nyckelordet `if` för att köra ett kodblock bara när ett villkor är sant, som en dörrvakt som bestämmer vem som kommer in."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Det finns ett nyckelord som hjälper oss att tala om för Jiki att han bara ska göra saker i vissa situationer. Kanske skriver du kod som ska vakta dörren till en bar, kanske är du dörrvakt, och Jiki ska bara öppna dörren om någon är rätt klädd. Eller kanske skriver du kod där du har ansvar för att vifta med målflaggan i slutet av ett lopp, men Jiki behöver veta att han bara ska göra det på sista varvet. I sådana situationer använder vi nyckelordet `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki som dörrvakt som avgör om folk ska släppas in på nattklubben"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki redo att vifta med målflaggan i slutet av ett lopp"
  width="266"
  height="400"
/>

Vi använder nyckelordet `if` på ungefär samma sätt som `repeat`. Vi skriver lite information i vanliga parenteser. I det här fallet är den informationen det villkor (_condition_ på engelska) som vi kollar. Sedan lägger vi ett kodblock i klammerparenteserna, och det blocket kör vi bara om villkoret är sant.

```javascript
if (condition) {
}
```

Så hur ser de här villkoren ut då? Jo, oftast är de någon form av jämförelse (_comparison_ på engelska). Vi jämför två tal eller strängar och kollar om resultatet är sant eller falskt.

Tänk på dem som påståenden (_statements_ på engelska) som du skulle kunna säga högt. Tre är mindre än fem. Det är sant. Sju är mindre än två. Det är falskt.

Vi använder symboler för att skriva jämförelserna. Du känner säkert redan igen dem från matten. Vi har mindre än, större än, mindre än eller lika med, större än eller lika med, och vi har också ett sätt att kolla om två saker är samma sak, om de är lika. Och det här är lite annorlunda mot vad du förmodligen är van vid, för vi använder tre likhetstecken i rad för att se om två saker är lika eller olika.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="En tabell med jämförelseoperatorer: mindre än, större än, mindre än eller lika med, större än eller lika med, lika med och inte lika med, med exempel"
  width="449"
  height="400"
/>

Det hjälper oss att inte blanda ihop det med när vi skapar eller uppdaterar variabler, då vi använder ett likhetstecken för att säga lägg det här i lådan. Kom bara ihåg: tre likhetstecken när du jämför.

Du kan jämföra strängar också. `"hello"` är lika med `"hello"`. Det är sant. De två strängarna är samma. Men var försiktig här, för Jiki jämför varenda tecken (_character_ på engelska) i båda strängarna, på båda lapparna. Så `"Hello"` med stort H är inte lika med `"hello"` med litet h. De är olika strängar. Att jämföra dem skulle alltså vara falskt, eftersom det stora H:et och det lilla h:et är olika tecken.

Förresten, sant och falskt kallas för booleska värden (_Booleans_ på engelska), och det är ännu ett ord som låter tekniskt. Men det är faktiskt jätteenkelt. Det är bara ett formellt sätt att säga att något antingen är sant eller falskt, ett sanningsvärde helt enkelt. Så när du stöter på ordet booleskt betyder det bara sant eller falskt. Nu ska vi se det här i praktiken. Tänk dig att vi bygger robotdörrvakten till en klubb, och vi bestämmer att dörrvakten bara ska öppna dörren om personen är 21 år eller äldre. Vi har alltså funktionen `askAge` (fråga efter ålder), som vi kan använda för att ta reda på någons ålder, och resultatet sparar vi i en variabel som heter `age` (ålder). Sedan kan vi säga att om `age` är större än 20, då öppnar vi dörren. Så om `askAge` returnerar `30` öppnar vi den, och om den returnerar `12` gör vi det inte.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki som öppnar dörren för någon som är gammal nog, och nekar entré för någon som är för ung"
  width="410"
  height="400"
/>
