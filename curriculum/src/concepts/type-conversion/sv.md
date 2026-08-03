---
title: "Typkonvertering"
description: "Att göra om ett värde av en typ till en annan, till exempel omvandla en sträng med siffror till ett tal med `Number()`, eller ett tal till en sträng med `String()`."
en_md5: 8d85e3d274a6cdfdb74bd0488b685f18
---

Varje värde i våra program har en typ. `"7"` är en sträng och `7` är ett tal. De kan se nästan likadana ut, men Jiki behandlar dem helt olika. Du kan inte lägga ihop strängen `"7"` med talet `3` och räkna med att få `10`, eftersom det ena är en bit text och det andra är en kvantitet.

Ganska ofta behöver vi flytta ett värde från en typ till en annan. Det kallas typkonvertering (_type conversion_ på engelska), och det finns två konverteringar du kommer att använda hela tiden.

### Göra om en sträng till ett tal

När du läser ut tecken ur en sträng är varje tecken i sig en sträng, även när det ser ut som en siffra. Innan du kan räkna med det behöver du göra om det till ett riktigt tal. Det gör vi med `Number()`.

```javascript
Number("7")
// 7

Number("42")
// 42
```

När du väl har ett faktiskt tal kan du addera det, multiplicera det och göra allt annat du vill.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

Om du ger `Number()` något som inte är ett giltigt tal, som `Number("cat")`, får du inte tillbaka något tal alls. Se därför till att du bara ger den strängar som verkligen är siffror.

### Göra om ett tal till en sträng

Den motsatta riktningen är precis lika användbar. Ibland har du ett tal och vill behandla det som text, kanske för att sammanfoga det med en annan sträng eller för att titta på siffrorna en och en. Det gör vi med `String()`, spegelbilden av `Number()`.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Nu när det är en sträng kan du använda alla vanliga strängverktyg på den, som att läsa den tecken för tecken eller kolla hur lång den är.
