---
title: "A tulajdonos csokrai"
description: "Ültess virágokat különböző kertekbe."
en_md5: bdb2a772a6549db0226a6c17326f20c6
---

Üdvözlünk a második, forgatókönyvekkel dolgozó feladatodban.

Itt vagyunk újra az automata kertészeti gépünkkel. Eddig mindig 9 virágot ültettünk, most viszont változnak a dolgok. A robotunknak képesnek kell lennie annyi virágot ültetni, amennyit a ház tulajdonosa mond neki.

Ehhez van egy `askNumberOfFlowers()` (megkérdezi, hány virágot kell ültetni) nevű függvényünk. Amikor meghívjuk, megkérdezzük a ház tulajdonosát, hány virágot kell ültetni, a függvény pedig visszaad egy számot a válasszal. Ha a függvény 3-at ad vissza, 3 virágot kell ültetnünk; ha 8-at ad vissza, 8 virágot kell ültetnünk.

Szigorú utasításunk van arra, hogy rendben tartsuk a kertet, ezért egyenletesen kell elültetnünk a virágokat a kertben. Ha 3 virág van, a 25, 50 és 75-ös helyeken kell elültetnünk őket. Ha 4 virág van, akkor a 20, 40, 60, 80 stb. helyeken kell elültetnünk őket. (Mint általában, a kert 100 egység széles.)

### Forgatókönyvek

Ahogyan az előző, golfos feladatban, a bal oldalon négy szürke pontot látsz a négy különböző forgatókönyvhöz. **Minden egyes pontra kattintva** másik forgatókönyvet látsz, de ezúttal az `askNumberOfFlowers()` ad vissza más-más számot minden alkalommal.

Az a feladatod, hogy írj egy programot, ami működik az `askNumberOfFlowers()` által visszaadható összes lehetséges értékre.

Sok sikert!
