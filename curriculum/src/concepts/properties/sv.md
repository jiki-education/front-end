---
title: "Egenskaper"
description: "Statiska fakta om ett värde, som du kommer åt med punktnotation och utan parenteser, till exempel `.length` för att ta reda på hur många bokstäver en sträng har."
en_md5: 0634cd72388bef118e9dd22131a3c1cd
---

Hittills har vi mest tänkt på strängar och tal som ganska statiska saker.

Och det är de, men de har också massor av inbyggd funktionalitet som Jiki kan använda.

Vi ska titta på två typer av förmågor: egenskaper och metoder.

Egenskaper är fakta som vi kan be Jiki berätta om saker. Strängar har till exempel en egenskap som heter `length` (längd), som Jiki kan använda för att tala om hur lång en sträng är.

Så i stället för att behöva loopa över alla bokstäver för att räkna ut hur stor en sträng är kan vi bara be Jiki berätta det.

Och för att göra det använder vi en ny form av syntax: en punkt.

Om vi till exempel har strängen `"Jeremy"` och vill få fram dess längd kan vi skriva:

```javascript
"Jeremy".length // 6
```

När Jiki skapar en sträng räknar han bokstäverna och skriver liksom bara en siffra i hörnet med hur många det är.

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki räknar bokstäverna i strängen Jeremy och skriver siffran i hörnet"
  width="359"
  height="400"
/>

Och när vi sedan använder egenskapen `length` går Jiki bara och kollar vad den siffran var. Så i vårt exempel `"Jeremy".length`: när Jiki skapar strängen `"Jeremy"` räknar han bokstäverna, skriver siffran sex i hörnet, och när vi sedan skriver `"Jeremy".length` går han och kollar den. Så du kan tänka på egenskaper som fakta om den saken.
