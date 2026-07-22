---
title: "Szótárak"
description: "Egy spirálfüzetlap, ahol minden bejegyzés bal oldalán egy kulcs, jobb oldalán pedig az értéke áll, így lista helyett címkézett adatokat kapsz."
en_md5: 779c3173c6489c94880a8c48e4f54e6a
---

Ha bármiből listánk van, mentorok listája, pontszámok listája, hozzávalók listája, bármilyen lista, akkor tömböt (array) használunk.

De van egy másik adatszerkezet (data structure) is, ami szintén nagyon gyakori, amikor valami kicsit összetettebbre van szükséged egy listánál.

Képzeld el, hogy el akarunk tárolni rólam néhány információt: a nevemet, a koromat, azt, hogy hol születtem. Használhatnál erre tömböt is, de úgy nem igazán világos, mi micsoda.

Anglia az, ahol születtem, vagy az, ahol élek? A 42 a korom, vagy valami más?

És ha használni akarom, észben kell tartanom, hogy az első hely a névé, a második a koré, a harmadik a születési helyé. Elég kusza az egész, és azért kusza, mert ez valójában nem egy lista. Ennél összetettebb dologról van szó. És itt jönnek képbe a szótárak. A szótár (dictionary) egy újfajta adatszerkezet. Ez már az ötödik: megvan a string (karakterlánc), a szám, a Boolean (logikai érték) és a tömb, most pedig jön a szótár.

És azt szeretném, ha a szótárra úgy gondolnál, mint egy spirálfüzet egy lapjára.

A bal oldalon vannak a címszavak, a name, az age és a birthplace szavak. Ezeket hívjuk kulcsoknak (key).

A jobb oldalon pedig, minden címszó mellett, ott a tényleges adat: Jeremy, 42, England. Ezeket hívjuk értékeknek.

Ahogy a tömb, a szótár is egyetlen dolog. Egyetlen lap egy füzetből. És ahogy a tömböt, Jiki a szótárt is belerakhatja egy változóba (variable), egy dobozba, beadhatja egy függvény (function) bemeneteként (input), vagy kivehet egy szótárt a kimeneti csúszdából. Íme, így néz ki egy szótár kódban. Kapcsos zárójelekkel (`{}`) jelöljük az elejét és a végét, belül pedig párok vannak: bal oldalt egy kulcs, utána egy kettőspont, jobb oldalt pedig az érték. A párok közé vesszőt teszünk. Jiki ránéz erre, és előveszi a spirálfüzetét. Felírja: name, Jeremy; age, 42; és így tovább, minden párra.

Amikor kész, letépi a lapot, és beleteszi egy person feliratú dobozba.

Van néhány szabály, amit érdemes tudni. A kulcs mindig string. Idézőjelek közé kell tenni, és minden kulcsnak egyedinek kell lennie. Nem lehet két name nevű kulcs ugyanabban a szótárban.

Az értékek lehetnek egyformák, ha úgy alakul, de a kulcsoknak különbözniük kell.

És az érték bármi lehet: string, szám, Boolean, tömb, vagy akár egy másik szótár.

Üres szótárad is lehet, ahogy üres tömbünk is volt: kezdhetünk azzal, és később építkezhetünk rá.

Megvan tehát a szótár, de hogyan szedsz ki belőle valamit?

Ugyanazt a szögletes zárójeles (`[]`) írásmódot használjuk, mint a tömböknél és a stringeknél, csak pozíciószám helyett egy kulcsot írunk bele.

Ha tehát valakinek a nevét akarjuk kiszedni egy szótárból, leírjuk a változót, person, majd szögletes zárójelben a kulcsot, ebben az esetben a name-et, idézőjelek között.

Ez azt mondja Jikinek, hogy nézzen bele a person szótárba, keresse meg a name kulcsot, és vegye ki az értékét. Jiki odamegy a person dobozhoz, kiveszi belőle a füzetlapot, végigpásztázza a kulcsokat, amíg meg nem találja a name-et, aztán leolvassa az értékét, Jeremy, és belerakja egy új, name nevű dobozba.

A szögletes zárójel mindig ugyanazt jelenti: belenyúlsz valamibe, és kiveszel belőle valamit. Tömböknél és stringeknél számmal mondod meg, melyik pozícióból akarsz kivenni valamit. Szótáraknál stringet használsz, a kulcsot.

Ugyanaz az ötlet, csak kicsit más az írásmód.
