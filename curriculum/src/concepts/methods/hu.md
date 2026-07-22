---
title: "Metódusok"
description: 'Olyan függvények, amelyek egy értékhez tartoznak, és ponttal hívjuk meg őket, például `"Jeremy".includes("e")` vagy `"Jeremy".toUpperCase()`.'
en_md5: e4802fd4cf7f7134f22fa54abbe44c50
---

Eddig a stringekre (karakterláncokra) és a számokra úgy gondoltunk, mint egészen statikus dolgokra.

És bár tényleg azok, rengeteg beépített funkció is rejlik bennük, amelyeket Jiki használni tud.

Ahogy haladunk előre, egyre többet tanulunk majd ezekről a funkciókról, ezekről a képességekről, amelyek sokkal könnyebbé teszik az életedet.

Kétféle képességet fogunk megnézni: a tulajdonságokat (property) és a metódusokat (method).

A metódusok olyan függvények (function), amelyek magához a stringhez tartoznak.

Vagyis ahelyett, hogy írnánk egy függvényt, amelynek bemenetként (input) átadunk egy stringet, a metódust közvetlenül a stringen használhatjuk.

Emlékszel például arra a függvényre, amelyikkel azt ellenőrizted, hogy egy stringben szerepel-e egy adott betű? Nos, a stringeknek van egy `includes` nevű metódusa, amelyik pontosan ezt csinálja, és ugyanúgy egy ponttal használhatjuk, ahogy a tulajdonságoknál láttad.

A tulajdonságokhoz képest az a különbség, hogy a metódusokat úgy írjuk le, mint a függvényeket: zárójelekkel és bemenetekkel.

Leírhatjuk tehát, hogy `"Jeremy".includes("e")`, és igaz értéket kapunk vissza, hiszen a Jeremy névben van E betű.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki egy papírra írja a Jeremy stringet"
  width="359"
  height="400"
/>

```javascript
"Jeremy".includes("e")
```

A metódusok abban különböznek a tulajdonságoktól, hogy nem statikus tények. Valójában függvények. Gondolhatsz rájuk úgy, mint olyan függvényekre, amelyekbe be van építve egy doboz, benne a stringgel.

Hogy pontosan hogyan működnek, az most még nem számít. Jó darabig nem fogsz még ilyeneket építeni. Csak annyit jegyezz meg, hogy egy metódust úgy használsz, hogy leírsz egy pontot, utána pedig a megszokott függvényírásmódot.

A stringeknél azt érdemes tudni, hogy a metódusok semmit nem változtatnak meg a stringen belül. Van például egy `toUpperCase` nevű metódus, amelyik a stringet csupa nagybetűvel adja vissza. Az eredeti string viszont nem változik meg. Abban továbbra is a Jeremy szerepel, csak a J-je nagybetű. Ehelyett Jiki egy új, csupa nagybetűs stringet hoz létre.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName)
log(name)
```
