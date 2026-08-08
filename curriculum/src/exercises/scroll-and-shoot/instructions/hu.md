---
title: "Görgetés és lövés"
description: "Görgess végig a Space Invaders-en, és iktasd ki az űrlényeket."
en_md5: a238bdc121bdfe425015d2e9e6b872d5
---

Újra itt a Space Invaders. Legutóbb csak balról jobbra kellett mozognod, hogy lelődd az összes űrlényt. De most a lézert ide-oda kell pattogtatnod, és több menetben kell leszedned az űrlényeket.

A lézert a `moveLeft()` (balra mozgat) és `moveRight()` (jobbra mozgat) függvényekkel mozgathatod balra és jobbra. Kísérletezhetsz, hogy meglásd, milyen messzire tudsz elmenni balra és jobbra. Ha leesel a képernyő széléről, vesztesz.

Mint korábban, amikor mozogsz, ellenőrizned kell, hogy van-e fölötted űrlény az `isAlienAbove()` (van-e fölötte űrlény) függvénnyel, és ha igen, akkor a `shoot()` (lő) függvénnyel lőj rá. Ha akkor lősz, amikor nincs ott űrlény, akkor vesztesz, mert a lőszerpazarlás tilos!

A lézerágyú könnyen túlmelegszik. Mozognod kell a lövések között, hogy hűvösen tartsd.

A hullámok egyre sűrűbbek lesznek, ahogy haladsz. Az utolsó hullámban az űrlények újra megjelennek, így nem lehet előre tudni, hány lövésre lesz szükséged. A ciklusodnak addig kell futnia, amíg minden űrlény el nem tűnik.

Ebben a feladatban egy szabály van: az utolsó forgatókönyv teljesítéséhez nem használhatsz bemenettel rendelkező repeat ciklust (vagyis használhatod a `repeat() { ... }`-t, de a `repeat(10) { ... }`-t **nem** használhatod).

Ha az összes űrlényt lelőtted, nyersz! Sok szerencsét!
