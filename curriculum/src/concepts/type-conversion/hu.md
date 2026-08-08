---
title: "Type Conversion"
description: "Egy érték átalakítása egyik típusból a másikba, például egy számjegyekből álló string számmá alakítása a `Number()` segítségével, vagy egy szám stringgé alakítása a `String()` segítségével."
en_md5: 8d85e3d274a6cdfdb74bd0488b685f18
---

A programjainkban minden értéknek van típusa. A `"7"` egy string, a `7` pedig egy szám. Első ránézésre szinte egyformák, de Jiki teljesen másképp kezeli őket. Nem adhatod hozzá a `"7"` stringet a `3` számhoz, és várhatod, hogy `10`-et kapj, mert az egyik egy szövegrészlet, a másik pedig egy mennyiség.

Gyakran előfordul, hogy egy értéket át kell helyeznünk egyik típusból a másikba. Ezt típuskonverziónak (_type conversion_ angolul) nevezzük, és van két ilyen konverzió, amit folyton használni fogsz.

### String átalakítása számmá

Amikor karaktereket olvasol ki egy stringből, minden karakter maga is egy string, még akkor is, ha számjegynek néz ki. Mielőtt bármilyen számolást végeznél vele, valódi számmá kell alakítanod. Ezt a `Number()` segítségével teheted meg.

```javascript
Number("7")
// 7

Number("42")
// 42
```

Ha már valódi számod van, összeadhatod, szorozhatod, és bármi mást is csinálhatsz vele.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

Ha a `Number()`-nek olyasmit adsz, ami nem érvényes szám, például `Number("cat")`, akkor egyáltalán nem kapsz vissza számot, ezért érdemes megbizonyosodnod arról, hogy csak olyan stringeket adsz neki, amelyek tényleg számjegyekből állnak.

### Szám átalakítása stringgé

Az ellenkező irány is ugyanilyen hasznos. Néha van egy számod, és szövegként szeretnéd kezelni, például hogy hozzáfűzd egy másik stringhez, vagy megnézd az egyes számjegyeit. Ezt a `String()` segítségével teheted meg, ami a `Number()` tükörképe.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Most, hogy már string, használhatod rajta az összes megszokott stringműveletet, például karakterenként beolvashatod, vagy megnézheted a hosszát.
