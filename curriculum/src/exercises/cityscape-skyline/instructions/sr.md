---
title: "Panorama grada"
description: "Napravi celu gradsku panoramu od nasumičnih zgrada."
en_md5: cb89a31566f55397d19e1375dbac44cc
---

U vežbi Neboder smo napravili jedan oblakoder sa spratovima različite visine. Ovog puta idemo dalje, pravimo panoramu grada od zgrada različite visine i različite širine.

Imaš funkciju `numBuildings()` (broj zgrada) koja ti govori koliko zgrada treba da napraviš za taj scenario. Zatim imaš funkcije `randomWidth()` (slučajna širina) i `randomNumFloors()` (slučajan broj spratova). Treba da ih koristiš da odrediš širine i broj spratova svake zgrade u tom scenariju. Kada prvi put pozoveš ove funkcije, dobijaš vrednosti za prvu zgradu; sledeći pozivi daju vrednosti za sledeće zgrade, i tako dalje.

Zgrade počinju sa prazninom od `1` kolone na levoj strani, a između njih postoji praznina od `1` kolone.

Dakle, ako zamisliš scenario u kom `numBuildings()` vraća `2`, a `randomWidth()` prvo vraća `5`, a zatim `7`, i `randomNumFloors()` prvo vraća `4`, a zatim `8`, dobićeš sledeći raspored (gde `xxxxx` označava betonsku podlogu):

```
       WWWWWWW
       WGGGGGW
       WGGGGGW
       WGGGGGW
 WWWWW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGGGW WGGGGGW
 WGEGW WGGEGGW
xxxxxxxxxxxxxxxxxxxxxxx
```
