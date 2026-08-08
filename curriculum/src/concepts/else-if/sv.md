---
title: "Else if"
description: "Kedja `else if`-grenar så att flera villkor kontrolleras i tur och ordning och bara det första blocket vars villkor är sant körs."
en_md5: 5e1c9b2e77abbd41708f4c33b9aabd8f
---

Du har sett hur `if` och `else` ger dig två vägar: gör en sak när ett villkor är sant, och gör en annan när det är falskt. Men vad gör du när du har fler än två möjligheter?

Tänk dig att vår dörrvakt säljer biljetter. Är du under tretton får du en barnbiljett. Är du mellan tretton och tjugo får du en ungdomsbiljett. Är du tjugo eller äldre blir det en vuxenbiljett. Nu har vi alltså tre olika utfall. Då kan vi lägga till ytterligare en `if`-sats efter `else`. Så vi kan säga: ”Om det här är sant, gör det här. Annars, om det där är sant, gör det där. Annars, gör den tredje saken.” I det här exemplet ser Jiki alltså `if`-satsen och kontrollerar det första villkoret. Är sexton mindre än tretton? Nej. Då går han vidare till `else if`. Är sexton mindre än tjugo? Ja, det är sant. Så han kör det blocket och delar ut en ungdomsbiljett. Men sedan är han klar. Han kontrollerar ingenting mer. Han tittar inte ens på den sista `else`-grenen. Så fort Jiki hittar ett villkor som är sant kör han det blocket och hoppar över allt som kommer efter.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Tre biljetter märkta CHILD, TEEN och ADULT, en för varje utfall av ålderskontrollen"
  width="500"
  height="142"
/>

Det här är det viktigaste att förstå: bara ett block körs, aldrig fler. Jiki arbetar sig nedåt i kedjan, hittar det första villkoret som är sant, kör det blocket och går sedan vidare.

Nu kommer en sak som är viktig att verkligen förstå, för det är här många snubblar. Det finns en subtil men mycket viktig skillnad mellan att skriva två separata `if`-satser och att använda `else if`. Tänk dig att vi skapar ett program som delar ut antingen ett vanligt pris eller ett bonuspris beroende på hur många poäng någon har. Titta på de här två möjligheterna. Den ena använder `else if` och den andra använder två separata `if`-satser. Vad blir skillnaden när de körs?

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

I det första fallet, med `else if`, kontrollerar vi om poängen är hög och delar ut bonuspriset, och sedan körs inte `else if`-grenen. Så den som har över hundra poäng får bara bonuspriset.

Men i det andra exemplet är de två `if`-satserna helt oberoende av varandra. Båda kommer att köras och båda villkoren är sanna. Så här får personen två priser. I det första exemplet ett pris. I det andra två priser. Ta en stund och se till att du verkligen förstår det.

Det är också intressant att notera att båda kan vara rätt, beroende på hur spelet är tänkt att fungera. Kanske ska deltagaren få både ett vanligt pris och ett bonuspris, eller så får hen bara bonuspriset i stället. Ingen av kodsnuttarna är rätt eller fel. De är bara användbara i olika situationer. Men du behöver veta vilken av dem du tänker använda.
