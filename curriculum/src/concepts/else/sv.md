---
title: "Else"
description: "Lägg till en `else`-gren efter en `if`-sats så att ett annat kodblock körs när villkoret visar sig vara falskt."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Med `if`-satser kan du kolla villkor och köra kod bara när något är sant. Nu ska vi presentera `if`-satsens trogna partner: `else`.

Med en `if`-sats (_if statement_ på engelska) kör Jiki kodblocket när villkoret är sant, och han hoppar över kodblocket när det är falskt. Men tänk om du vill att Jiki ska göra en sak när villkoret är sant och en annan sak när det är falskt? Det är precis vad else är till för. Vi kan sätta en `else`-gren (_else clause_ på engelska) efter den avslutande klammerparentesen i `if`-satsen, och då kör Jiki den koden om villkoret är falskt. Om vi går tillbaka till exemplet med dörrvakten på klubben kan vi nu välja mellan att öppna dörren och att avvisa personen, vilket förmodligen är bättre än att totalt ignorera folk som vi gjorde tidigare. Tänk på det som ett vägskäl. Jiki kommer fram till vägskälet och kollar villkoret. Sedan kan han gå åt ena hållet om det är sant, eller åt andra hållet om det är falskt. Men han går aldrig åt båda hållen.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Ett vägskäl vid klubbdörren: öppna dörren när villkoret är sant, avvisa personen när det är falskt"
  width="500"
  height="332"
/>

Men tänk om du har fler än två möjligheter? Föreställ dig att vår dörrvakt säljer biljetter. Under tretton år får du barnbiljett. Mellan tretton och tjugo får du ungdomsbiljett. Tjugo eller äldre, då blir det vuxenbiljett. Nu har du alltså tre olika utfall. För det här kan vi lägga till en ny `if`-sats efter else. Vi kan säga: ”Om det här, gör det här. Annars om det här, gör det där. Annars, gör den här tredje saken.” I det här exemplet ser Jiki `if`-satsen och kollar det första villkoret. Är sexton mindre än tretton? Nej. Så han går vidare till else if. Är sexton mindre än tjugo? Ja, det är sant. Så han kör det blocket och delar ut en ungdomsbiljett. Men sedan är han klar. Han kollar inget mer. Han tittar inte alls på den sista `else`-grenen. När Jiki väl hittar ett villkor som är sant kör han det blocket och hoppar över allt annat nedanför.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Det här är det viktiga att förstå. Bara ett block körs någonsin. Jiki jobbar sig nedåt i kedjan, hittar det första villkoret som är sant, kör det blocket och går vidare.

En sak till behöver du verkligen förstå, för det här är något som många snubblar på. Det finns en subtil men mycket viktig skillnad mellan att skriva två separata `if`-satser och att använda else if. Föreställ dig att vi skapar ett program som delar ut antingen ett vanligt pris eller ett bonuspris beroende på någons poäng. Titta på de här två möjligheterna. Den ena använder else if och den andra använder två separata `if`-satser. Vad blir skillnaden?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

I det första fallet, med else if, kollar vi om poängen är hög och delar ut priset, och sedan körs else if inte alls. Så en person med över hundra poäng får bara bonuspriset.

Men i det andra exemplet är de två `if`-satserna helt oberoende av varandra. Båda körs, och båda villkoren är sanna. Så här får personen två priser. I det första exemplet ett pris. I det andra två priser. Ta en stund och se till att du verkligen förstår det.

Det är också värt att notera att båda varianterna kan vara rätt, beroende på hur spelet är utformat. Kanske ska deltagaren få både ett vanligt pris och ett bonuspris, eller kanske uppgraderas hen bara till bonuspriset. Ingen av kodsnuttarna är rätt eller fel. De är bara användbara i olika situationer. Men du behöver veta vilken av dem du tänker använda.
