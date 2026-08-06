---
title: "Kihajtó virág"
description: "Használd a változók közötti kapcsolatokat, hogy megeleveníts egy földből kinövő virágot."
en_md5: acd8f364af4cfdc8f76ced2b17539bbb
---

A feladatod egy virág elkészítése, amely `60` iteráción keresztül nő.

Az animációnak valahogy így kell kinéznie.

<img src="/static/images/exercise-assets/sprouting-flower/frames.webp" alt="Képkockák, amint egy virág nő ki a földből 60 iteráción át" style="width: 100%; max-width: 600px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

A gyakorlat lényege, hogy összefüggéseket építs a különböző elemek között. Ez alapvető programozási készség.

**Mielőtt tovább olvasnád az utasításokat**, szánj néhány percet arra, hogy logikusan átgondold, hogyan lehet ezt megvalósítani. Írd le egy papírra a szerinted követendő lépéseket.

**Amikor már van egy megoldásod**, amivel elégedett vagy (vagy feladtad), **görgess lejjebb** az utasításokért.

---

## Hogyan oldd meg

A megoldás kulcsa a virág közepe. Minden más ebből a középpontból számítható ki. A ciklus minden iterációjában a középpont `1`-gyel mozduljon felfelé (a rajzolás előtt).

Íme néhány további tudnivaló:

- A rajzvászon bal felső sarka `0,0`. A jobb alsó sarka `100,100`.
- A virág sugara `0`-ról indul. Minden iterációban `0.4`-del nőjön (rajzolás előtt).
- A bibe (a virág sárga közepe) sugara `0`-ról indul. Minden iterációban `0.1`-del nőjön (rajzolás előtt).
- A szár a virág közepéből induljon, és érjen le a földig.
- A szár szélessége a magasságának 10%-a (tehát `stemHeight / 10` (a szár magassága osztva tízzel)).
- Minden a vízszintes tengelyre van középre igazítva.
- A levelek mindkét oldalon szorosan a szárhoz simulnak.
- A levelek a szár felénél helyezkednek el.
- A levelek `radiusX`-e (vízszintes sugara) a virág sugarának 50%-a.
- A levelek `radiusY`-a (függőleges sugara) a virág sugarának 20%-a.
- A virág feje lehet `"red"` vagy `"pink"`, ízlés szerint. A bibe (a virág közepe) legyen `"yellow"`. A fű legyen `"green"`. A háttér `"skyblue"`.

**Nagyon fontos**, hogy egyszerre csak egy dologgal foglalkozz:

- Kezdd azzal, hogy lerajzolod a rózsaszín virágot, és eléred, hogy felfelé mozogjon.
- Aztán érd el, hogy növekedjen.
- Add hozzá a kisebb sárga középpontot.
- Add hozzá a szárat.
- Add hozzá a bal levelet.
- Add hozzá a jobb levelet.

Használd a tekerősávot a kód görgetéséhez, hogy kiderítsd, hol romlik el a dolog.

### Ez egy nehéz gyakorlat

Ez egy kihívást jelentő gyakorlat. Ne siess. Ha nagyon elakadsz, kérj segítséget, és ne feledd, hogy adj minél több információt arról, mi nem működik, és szerinted miért.

Használd a tekerőt (a lejátszósáv a bal alsó sarokban), hogy ellenőrizd a változóid értékét, ha nem világos, mi történik. Kattints a kis kapcsológombra, hogy minden sorról információt láss.

Ne feledd: a tanulás a küzdelemben rejlik. Minden alkalommal, amikor elrontasz valamit, majd megoldod, egyre inkább programozóvá válsz. Idővel könnyűnek fog érződni. Csak folytasd.
