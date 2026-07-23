---
title: "Tulajdonságok"
description: "Állandó tények egy értékről, amelyeket egy ponttal, zárójelek nélkül érünk el, például a `.length` megmondja, hány betűből áll egy string."
en_md5: dc4f80c47bcb534e5746b8626e987cac
---

Eddig, amikor stringekről vagy számokról volt szó, eléggé állandó dolgokként gondoltunk rájuk.

És bár tényleg azok, rengeteg beépített képességük is van, amit Jiki használni tud.

Kétféle képességet fogunk megnézni: a tulajdonságokat és a metódusokat.

A tulajdonságok olyan tények, amelyeket Jikitől megkérdezhetünk a dolgokról. A stringeknek például van egy `length` (hossz) nevű tulajdonságuk, amelynek segítségével Jiki meg tudja mondani, milyen hosszú egy string.

Így ahelyett, hogy az összes betűn végig kellene mennünk, hogy kiderítsük, milyen hosszú egy string, egyszerűen megkérdezhetjük Jikit.

Ehhez pedig egy új írásmódot használunk, a pontot.

Ha például van egy `"Jeremy"` stringünk, és tudni szeretnénk a hosszát, egyszerűen leírjuk, hogy `"Jeremy".length`, és kész is.

```javascript
"Jeremy".length
```

Amikor Jiki létrehoz egy stringet, megszámolja a betűket, és a sarkába egyszerűen felír egy számot, hogy hány darab van.

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki megszámolja a Jeremy string betűit, és a sarkába írja a számot"
  width="359"
  height="400"
/>

És amikor a `length` tulajdonságot használjuk, Jiki egyszerűen megnézi, mi volt az a szám. Vagyis a `"Jeremy".length` példánkban, amikor Jiki létrehozza a `"Jeremy"` stringet, megszámolja a betűket, felírja a sarkába a hatost, és amikor leírjuk, hogy `"Jeremy".length`, odamegy és megnézi. A tulajdonságokra tehát úgy is gondolhatsz, mint az adott dologról szóló tényekre.
