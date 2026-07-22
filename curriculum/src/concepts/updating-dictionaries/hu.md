---
title: "Szótárak módosítása"
description: "A `dict[key] = value` használata meglévő bejegyzések frissítésére vagy újak hozzáadására, valamint a `has` metódus a kulcsok ellenőrzésére."
en_md5: fa98467afebe0dc9185744930f26a357
---

Tudod már, hogyan hozol létre egy szótárt (dictionary), és hogyan olvasol ki belőle értékeket. De mi történik, ha megváltoznak az adatok? Egyszer én is öregebb leszek. Nem 42 leszek, hanem 43.

Hogyan frissítjük hát a szótárt? Nos, nagyon hasonlóan ahhoz, ahogy keresünk benne. Azt már tudod, hogy egy értéket szögletes zárójellel (`[]`) olvasunk ki. Nos, ha a szögletes zárójel után egy egyenlőségjelet is írunk, azzal frissíteni tudjuk a szótárt. Jiki odamegy a person dobozhoz, kiveszi a jegyzetfüzet lapját, megkeresi az age kulcsot, kiradírozza az ott lévő 42-t, a helyére 43-at ír, aztán a lap visszakerül a füzetbe, a füzet pedig a dobozba. Így magát a szótárt változtatjuk meg.

```javascript
person["age"] = 43
```

Jiki nem új szótárt készít, hanem azt a jegyzetfüzetet módosítja, ami már eleve a dobozban volt.

És mi van akkor, ha olyan információt szeretnél hozzáadni, ami eddig nem volt benne? Nos, pontosan ugyanezt kell tenned.

Ha olyan kulcsot adsz meg, amelyik nem létezik, Jiki egyszerűen felvesz egy új kulcsot a lista aljára, ezzel az értékkel.

Ebben az esetben tehát kinyitja a jegyzetfüzetet, keresi a country kulcsot, látja, hogy nincs ott, és új sort ír a lap aljára: a bal oldalra a country kerül, a jobb oldalra az England.

```javascript
person["country"] = "England"
```

Tehát pontosan ugyanaz a szintaxis, mint egy érték módosításánál. Jiki mindkettőt automatikusan kezeli. Ha a kulcs létezik, frissíti. Ha nem, hozzáadja. Neked semmi különöset nem kell tenned.

És ahogy egy üres tömbbel (array) is kezdhetsz, amibe aztán egyesével teszed bele az elemeket, ugyanúgy kezdhetsz egy üres szótárral is, amihez egyenként adod hozzá a kulcsokat. Ez is nagyon gyakori minta, lépten-nyomon találkozni fogsz vele.

A szótárakat gyakran használjuk arra, hogy számon tartsunk dolgokat. A kulcsok azok a dolgok, amiket számolni szeretnénk, az értékek pedig a darabszámok. Képzeld el, hogy madarakat figyelsz, és szeretnéd követni, melyik madárból hányat láttál. Amikor először látsz egy madarat, az értékét egyre állítod, minden további alkalommal pedig kiolvasod az aktuális értékét, és megnöveled eggyel. Ahhoz, hogy ez a minta működjön, kell egy mód annak ellenőrzésére, hogy a szótárban benne van-e már az adott kulcs. Ha igen, hozzáadunk egyet az értékéhez, ha nincs, egyről indítjuk.

Erre való a szótárak egyik metódusa (method), a `has`.

Megadod a kulcsot, ami érdekel, Jiki pedig ellenőrzi, hogy a szótárban benne van-e ez a kulcs, és ennek megfelelően igazat vagy hamisat ad vissza.

```javascript
person.has("age")
```

Mindezt összerakva a számolós minta így néz ki:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
