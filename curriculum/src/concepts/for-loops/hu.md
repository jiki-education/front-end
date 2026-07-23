---
title: "For ciklusok"
description: "Egy három részből álló ciklus (kezdőérték, feltétel és léptetés), amellyel teljesen kézben tarthatod az iterációt."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Talán emlékszel rá, hogy a repeat ciklus valójában nem is létezik a JavaScriptben. Csak azért kaptad, hogy az elején egy kicsit könnyebb legyen a dolgod.

Akkor mit használunk helyette? Nos, egy sima `for` ciklust, ami így néz ki.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Láthatod, miért tűnhetett volna ez az első napon kicsit ijesztőnek.

Mostanra viszont minden tudásod megvan hozzá, hogy megbarátkozz vele. Nézzük is meg lépésről lépésre!

A `for` ciklusnak három része van: egy kezdőérték (_initializer_ angolul), egy feltétel és egy léptetés (_increment_ angolul).

A kezdőérték, ez a `let i = 0` rész, a ciklus legelején fut le. Csak egyszer fut, és itt egy `i` nevű dobozt hoz létre, nullára állítva. Az `i` csak egy betű, amivel a ciklus közben követünk egy értéket; hagyományosan az `i` vagy az `x` betűt használjuk erre.

A következő rész, a feltétel, minden egyes iteráció előtt lefut.

Ha a feltétel igaz, a ciklus újra lefut.

Ha nem, akkor nem.

Végül pedig ott a léptetés, az `i++`.

Az `i++` pontosan ugyanazt jelenti, mint az `i = i + 1`. Ez csak egy rövidítés, hogy `i`-t minden körben eggyel megnöveljük.

Ebben a példában tehát `i`-t nullára állítjuk. Megnézzük, hogy `i` kisebb-e kettőnél. Kisebb, úgyhogy lefuttatjuk a ciklust.

A végén pedig `i`-t megnöveljük eggyel, így `i` értéke egy lesz. Nulla meg egy az egy.

Aztán megyünk tovább. Megnézzük, hogy egy kisebb-e kettőnél.

Kisebb, úgyhogy lefut a ciklus. A végén `i`-t megint megnöveljük. Így most már kettő: egy meg egy az kettő.

```javascript
i = 0
i < 2 // igaz - lefut a ciklus
...   // Elvégezzük az iterációt
i = i + 1 // 1

i < 2 // igaz - lefut a ciklus
...   // Elvégezzük az iterációt
i = i + 1 // 2

i < 2 // hamis - kilépünk a ciklusból
```

Aztán jön a harmadik kör. Most azt nézzük meg, hogy kettő kisebb-e kettőnél. Nem kisebb, úgyhogy a ciklus nem fut le, sőt, végeztünk is vele. Egyszerűen továbblépünk az alatta lévő kódra. A ciklus tehát összesen kétszer futott le, és ezt érdemes megjegyezni: ha nullától indulunk, és a feltétel `i < n`, akkor az `n` szám adja meg, hányszor fut le a ciklus.

Ez tehát ugyanaz, mintha azt írnánk: repeat 2.

Szóval nem nehéz, csak sokkal körülményesebb, mint simán leírni, hogy repeat 2. A `for` ciklus előnye viszont az, hogy ebbe a három részbe bármit írhatsz. Kezdhetsz másik számtól, léptethetsz egynél többet, számolhatsz visszafelé, vagy használhatsz olyan feltételt, ami nem egy egyszerű számlálótól függ. Ez a rugalmasság teszi a `for` ciklust a JavaScript igáslovává.
