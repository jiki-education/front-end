---
title: "Felhőkarcoló"
description: "Építs egy felhőkarcolót a városi rácsra."
en_md5: 901851ded0ac8a0ef6cb80db60e59998
---

Ez az első abból a két feladatból, amelyekben felhőkarcolókat fogsz építeni.

Ebben a feladatban egyetlen felhőkarcolót kell építened a jelenet közepére. Minden forgatókönyvben a felhőkarcoló magassága változik.

Ahhoz, hogy meghatározd, hány szintet kell építeni, rendelkezésedre áll egy `numFloors()` (szintek száma) függvény, ami az épület teljes magasságát adja vissza.

Három különböző komponenst használhatsz: fal (`W`), üveg (`G`) és bejárat (`E`). Nézd meg az alábbi függvényeket, hogy lásd, hogyan hozhatod létre őket.

A talajhoz legközelebbi szint (földrajztól függően „földszint” vagy „első emelet”!) mindig egy bejáratot tartalmaz. A bejáratot két üvegszegmens fogja közre, a szélein pedig egy-egy falszegmens zárja (`WGEGW`).

A többi szint három üvegszegmensből áll, amelyeket falak fognak közre (`WGGGW`). A szintek tetején pedig egy tető helyezkedik el (`WWWWW`).

Tehát egy 5 szintes felhőkarcolónak egy bejárati szintje, 4 üveg szintje és egy tetője van. Valahogy így kell kinéznie:

```
WWWWW
WGGGW
WGGGW
WGGGW
WGGGW
WGEGW
```

A felhőkarcoló közepének a `19`-edik oszlopban kell lennie. A földszint a `2`-es sorban kezdődik (közvetlenül a betonpadló fölött), és felfelé halad (így a fenti példában ez egy bejárati szint a `2`-es sorban, a tető pedig a `7`-esben).

Egy fontos szabály ebben a feladatban, hogy a függvényeknek átadott értékek csak változók vagy képletek lehetnek. Nem adhatsz meg közvetlenül számot, például `20`-at.

Ha befejezted ezt a feladatot, feloldasz egy Projektet, amelyben teljes városi látképeket építhetsz fel különböző számú, eltérő szélességű épülettel.
