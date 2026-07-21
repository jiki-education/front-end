---
title: "Scope"
description: "Ismerd meg, hogyan kap minden kapcsos zárójel saját polcot, és miért él egy változó csak addig, amíg a kódblokkja."
en_md5: dc4c0a3061dfdae3944f20f5523ce9f2
---

Képzelj el egy kódot, amely minden futtatáskor máshová rajzol egy kört, mi pedig 10 kört szeretnénk rajzolni, mindet más helyre. Ezt összeköthetnénk egy ciklussal (loop). De ha nagyon figyelsz, itt észrevehettél valami furcsát.

```javascript
repeat(10) {
  let left = Math.randomInt(0, 100)
  let top = Math.randomInt(0, 100)
  circle(left, top, 5, "blue")
}
```

Korábban azt mondtam, hogy van egy szabály, amely szerint a Jiki polcain álló dobozoknak egyedi nevet kell adni,

az a `let` kulcsszó (keyword) pedig minden egyes használatkor új dobozt hoz létre.

De mivel a let egy cikluson belül van, Jiki a ciklus minden futásakor új dobozt fog létrehozni.

Akkor most hibás a kód, vagy valami más furcsaság történik itt?

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/thinking-jiki.webp"
  alt="A tanácstalan Jiki azon tűnődik, vajon hibás-e a kód"
  width="384"
  height="400"
/>

Nos, kiderül, hogy a kóddal semmi baj. Ez teljesen érvényes JavaScript, és egy scope-nak (magyarul hatókörnek) nevezett fogalomnak köszönhetően működik.

A scope elsőre valószínűleg egészen egyszerűnek tűnik majd, de garantálom, hogy a pályafutásod hátralévő részében még sok fejfájást fog okozni. A scope-pal még a legtapasztaltabb fejlesztőknek is meggyűlik a baja, és ebből a szempontból a JavaScript az egyik legbonyolultabb nyelv. Azért mondom ezt el, hogy amikor te is beleütközöl egy scope-problémába, ne érezd magad rosszul miatta. De nagyon figyelj erre a részre, mert fontos.

Amikor a kódban kapcsos zárójelet (`{}`) látsz, az egy új scope-ot hoz létre. Hogy ez mit jelent? Képzeld el úgy, hogy Jiki minden kapcsos zárójelnél felállít egy új, kis polcot a műhelyében. És minden doboz, amit munka közben, vagyis a kapcsos zárójeleken belüli kód futtatása közben létrehoz, ezek a dobozok, ezek az új dobozok mind erre a kis új polcra kerülnek, nem a fő polcokra.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves.webp"
  alt="Jiki fő polca mellett egy új, kisebb polc, amelyet egy kapcsos zárójel hozott létre"
  width="500"
  height="205"
/>

Amikor pedig Jiki elér a hozzá tartozó záró kapcsos zárójelhez, erről a kisegítő polcról az összes dobozt kidobja.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves-loop-end.webp"
  alt="Jiki a kukába dobja a kisegítő polcon lévő dobozokat, amikor elér a záró kapcsos zárójelhez"
  width="500"
  height="237"
/>

Tehát valahányszor van egy ilyen ciklusunk, létrehozhatunk olyan dobozokat, amelyek csak a ciklus egy-egy körének idejéig élnek. A left és a top doboz, amit itt látsz, csak addig marad meg, amíg el nem érjük a záró kapcsos zárójelet, utána a kukába kerül. Jiki pedig a ciklus minden futásakor eléri ezt a záró kapcsos zárójelet. Ebben a programban ez 10 alkalmat jelent. Vagyis 10-szer hoz létre egy left nevű dobozt, és 10-szer dobja is ki.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/left-top-boxes-color.webp"
  alt="Két doboz left és top felirattal, amelyek csak a ciklus egyetlen iterációjáig élnek"
  width="500"
  height="187"
/>

Amikor tehát létrehozol egy változót (variable), el kell döntened, meddig szeretnéd megtartani. Ha azt akarod, hogy sokáig éljen, minden kapcsos zárójelen kívülre kell kerülnie. Ha csak egyetlen iterációra, a ciklus egyetlen körére van rá szükséged, akkor a kapcsos zárójeleken belülre teheted. Látod, hogy ez az egész mennyire össze tud kavarodni? Kezdőként ezért jól jön egy egyszerű szabály: tartsd az összes változódat a kódod eleje közelében, a kapcsos zárójeleken kívül, és a zárójeleken belül csak frissítsd őket. A fenti kódot például megírhatnánk úgy is, hogy csak egy left és egy top dobozunk van, az elején nullára állítva, és a cikluson belül minden körben frissítjük őket. Ez is teljesen érvényes megoldás. Egyik sem jó vagy rossz. Léteznek bevált gyakorlatok, de azokról majd később tanulunk. Egyelőre kísérletezz, játssz bátran, nézd meg, mi esik a legjobban kézre, és próbálj nem túl sokat aggódni emiatt.
