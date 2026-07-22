---
title: "Végigmegyünk a string betűin"
description: "A `for-of` ciklussal lépésről lépésre végigmegyünk egy string összes betűjén, és mindegyikkel csinálunk valamit."
en_md5: 2e414accd958f7bf46601610b9e69ec7
---

Egy string (karakterlánc) egy-egy betűjét szögletes zárójellel (`[]`) érheted el. Most azt nézzük meg, hogyan mehetsz végig egy stringen úgy, hogy a betűit egyenként veszed ki.

Ehhez egy új fajta ciklusra (loop) lesz szükségünk. Eddig a repeat ciklust használtuk, most viszont egy úgynevezett `for-of` ciklus következik. Ez két új kulcsszót (keyword) jelent: a `for`-t és az `of`-ot.

A for kulcsszóval a későbbiekben is sok helyen találkozunk majd. Állhat önmagában, vagy párban az `in`-nel vagy az `of`-fal. Egyelőre az utóbbira, az `of`-ra koncentrálunk.

Nézzünk is meg egy kis kódot.

Először létrehozunk egy name nevű változót (variable), amiben a Jeremy string van. Ebben még semmi újdonság nincs.

Aztán jön ez a sor: `for (let letter of name) {`. Elég sok minden történik benne, úgyhogy vegyük végig szépen lassan.

```javascript
let name = "Jeremy"
for (let letter of name) {
  // ...
}
```

Először is ott a for kulcsszó. Ebből tudja Jiki, hogy ciklust szeretnénk. Előrenéz, meglátja az `of`-ot, és már tudja is, hogy for-of ciklusról van szó.

Ez pedig azt jelenti, hogy nem egy repeat ciklust használunk, ahol azt mondjuk: „menjünk körbe tízszer", hanem azt mondjuk: „menjünk végig a string összes betűjén". Ezt jelenti a for-of.

Aztán ott ez a `let letter` rész. Ez pontosan ugyanaz, mint fentebb a `let name`: egyszerűen létrehozunk egy letter nevű változót.

A különbség csak annyi, hogy nem mi mondjuk meg pontosan, mi kerüljön bele, hanem arra kérjük Jikit, hogy a string betűit tegye bele egyenként.

Jiki tehát meglátja a for-t, megnézi, hogy ott van-e az of, aztán nekilát. Megnézi a string első betűjét, ami itt a J, és beleteszi egy új, letter nevű dobozba. Ezt a dobozt egyébként bárhogy hívhatnánk, nem kötelező letter-nek lennie. Itt egyszerűen így döntöttünk.

Ezután lefuttatja a kapcsos zárójelek (`{}`) közti kódot. Ide bármit írhatsz, amit máshol is írnál a kódban. Az egyetlen különbség, hogy ez a kódblokk a string minden betűjére lefut egyszer, és közben ez a változó is elérhető benne.

Valahányszor Jiki a záró kapcsos zárójelhez ér, kidobja a letter dobozt, és készít egy újat, benne a következő betűvel. Első alkalommal tehát kidobja a J-t, és helyette egy E-t tesz a dobozba. Aztán ugyanezt megcsinálja az R-rel, majd az E-vel, az M-mel és az Y-nal. Hat betű, hatszor megyünk körbe a ciklusban. A szintaxist kicsit meg kell szokni, de maga az ötlet igazából nem nehéz.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-iteration/jiki-letter-box-loop.webp"
  alt="Jiki kidobja a régi letter dobozt, és a következő betűt egy új, letter feliratú dobozba ejti, ezt ismétli a string minden betűjével"
  width="500"
  height="168"
/>
