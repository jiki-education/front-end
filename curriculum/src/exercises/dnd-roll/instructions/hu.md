---
title: "D&D dobás"
description: "Dobj a kockákkal, és csapj le egy koboldra egy D&D kalandban."
---

Egy botot készítesz, amelyik Dungeons and Dragonst (DnD) tud játszani. Ha nem ismered a DnD-t, az alapötlet az, hogy sok különböző helyzettel találkozol, és kockákkal dobsz, hogy kiderüljön, mi történik. Sokféle kocka van, különböző oldalszámmal (nem csak a hatoldalú kocka, amit megszokhattál)!

Az egyik helyzet, amit kezelned kell, egy kobolddal való találkozás. Ahhoz, hogy megtámadd a koboldot, a következőket kell tenned:

- Készíts egy **támadási pontszámot** egy 20 oldalú kocka feldobásával.
- Készíts egy **alap sebzési pontszámot** egy 12 oldalú kocka feldobásával.
- Készíts egy **bónusz sebzési pontszámot** egy 10 oldalú kocka feldobásával.
- Add össze az alap sebzést és a bónusz sebzést, hogy megkapd az **összes sebzést**.
- Csapj le a koboldra a támadó dobásoddal és az összes sebzéssel.

Minden kockadobás után be kell jelentened a dobott számot a többi játékosnak, akikkel játszol. Ha úgy próbálsz lecsapni, hogy nem jelented be a számokat, azt hihetik, hogy csalsz!

Három függvényt használhatsz:

- A `roll(sides)` feldob egy adott oldalszámú kockát. Ez a függvény visszaadja az eredményt.
- Az `announce(value)` bejelent egy kockadobást.
- A `strike(attack, damage)` lecsap a koboldra a támadó dobásoddal és az összes sebzéssel.

**Fontos:** Minden alkalommal, amikor meghívod a `roll()`-t, Jiki feldob egy kockát, és más számot kap. Ne várd, hogy ugyanazt a kockát kétszer feldobva mindig ugyanaz a szám jön ki.
