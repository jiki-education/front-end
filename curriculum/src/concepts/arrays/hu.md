---
title: "Tömbök"
description: "Elemek rendezett lánca (stringek, számok, Boolean-ök vagy bármi más), amelyet Jiki egyetlen értékként tud kezelni és továbbadni."
en_md5: bb6d40623e9be3fbf543379cd231b328
---

Eddig számokat, stringeket (karakterláncokat) és Boolean-öket (logikai értékeket, ez az igaz és a hamis előkelő neve) használtál, és ezeket különböző adattípusoknak (data type) nevezzük. Most pedig megismerkedünk az első összetett adattípusunkkal (compound data type).

Ez egy olyan adattípus, amely nem csak egy dolgot tartalmazhat, hanem többet is. Ezt az adattípust tömbnek (array) hívjuk.

Amikor a tömb szót hallod, azt szeretném, ha egy valódi láncot képzelnél el, amely sok mindent tart össze.

Amiket összetart, azok bármik lehetnek: stringek, számok, Boolean-ök, akár más tömbök, sőt olyan dolgok is, amikről még nem is tanultál. De emiatt most ne aggódjunk.

A láncban minden sorban van, mégpedig abban a sorrendben, ahogy összefűztük őket.

Egy tömb tehát sok dolgot tartalmaz, mégis egyetlen egész: egy tömb, benne sok elemmel (element).

Jiki foghatja ezt a tömböt, ezt a láncot, és beteheti egy dobozba, pontosan úgy, ahogy egy stringet vagy egy számot is dobozba tesz.

Bedughatja egy gép bemeneti nyílásába, és kihúzhatja a kimeneti csúszdából. A tömb egyetlen dolog, és Jiki pontosan ugyanúgy bánik vele, mint a stringekkel, a számokkal és minden mással, amit eddig láttál.

A kódban ráadásul a tömb ránézésre is hasonlít egy kicsit a láncra. A két végén egy-egy szögletes zárójel (`[]`) van, közöttük pedig a sok összefűzött elem, vesszővel elválasztva.

Ha például egy tömböt szeretnénk létrehozni a bootcampünk néhány tagjának nevével, készíthetünk egy mentors nevű dobozt, és beletehetjük ezt a láncot.

Leírjuk, hogy `let mentors =`, pontosan úgy, ahogy bármelyik másik doboznál, aztán jön egy nyitó szögletes zárójel, a sok elem, vagyis a nevek vesszővel elválasztva, végül egy csukó szögletes zárójel. Amikor Jiki ezt meglátja, fog négy papírlapot, mindegyik névhez egyet, aztán elővesz egy új láncot, összefűzi rajta mindet, és a kész láncot beteszi a mentors dobozba.

Egy tömbbe bármit tehetsz: stringeket, számokat, Boolean-öket, akár vegyesen is.

Ezek mind más-más példák, de mindegyik teljesen érvényes tömb.

Üres tömböt is létrehozhatsz. Az csak egy lánc elemek nélkül. Attól még valódi dolog: megvan mindkét vége, ugyanúgy lánc, csak éppen nincs rajta semmi. Ezt az üres tömböt is beteheted egy dobozba, kiveheted, és később használhatod.

Tömböt tehát a szögletes zárójeles írásmóddal hozhatsz létre. De hogyan használjuk őket? Hogyan nézzük meg, mi van bennük, és hogyan veszünk ki belőlük dolgokat? Nos, pontosan úgy, ahogy a betűket vettük ki egy stringből: szögletes zárójelet írunk, benne egy számmal.

Térjünk vissza a mentoraink listájához. Ha az elsőt szeretnénk kivenni, azt írjuk: `mentors[0]`. Ne felejtsd el, hogy JavaScriptben nullától számolunk.

Egy tömbön ugyanúgy végig is mehetünk, ahogy korábban a stringeken végigmentünk, a `for-of` segítségével.

A tömbök pontosan ugyanígy működnek. Az egyetlen különbség, hogy most nem egy betűt kapunk, hanem azt, ami a tömbben éppen ott van. Ebben a példában a mentor nevét.

Először tehát DJ-nek mondunk köszönetet, másodszor Beckynek, és így tovább.

A tömbökön a `length` tulajdonságot (property) is használhatjuk, ahogy a stringeknél tanultuk. Ha a mentors dobozban egy négy stringből álló tömb van, és leírjuk, hogy `mentors.length`, akkor négyet ad vissza.

Az includes is ugyanígy működik a tömbökön. Ha azt írjuk, `mentors.includes("DJ")`, igazat ad vissza. Ha viszont azt, hogy `mentors.includes("Frank")`, hamisat.

Minden pontosan ugyanúgy működik, mint a stringeknél. Csak most a tömb elemeivel dolgozunk, nem a string betűivel.
