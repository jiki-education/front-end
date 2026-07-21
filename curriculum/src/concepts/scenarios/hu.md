---
title: "Forgatókönyvek"
description: "Különböző kiindulási helyzetek, amelyekben a feladat ugyanazt az egy kódodat futtatja, így mindegyikben működnie kell."
en_md5: a8fc1c5bd1269e1a769896af92856c53
---

Minden feladathoz különböző forgatókönyvek (scenarios) tartoznak: különböző helyzetek, amelyeket a kódodnak kezelnie kell.

Ezeket kis gombok formájában látod, közvetlenül a feladat kimenete (output) fölött. Minden gomb egy-egy külön forgatókönyvhöz tartozik. A te dolgod az, hogy olyan kódot írj, amely mindegyikben működik, nem csak az elsőben. Hadd mondjam el még egyszer: a kódodat egyszer írod meg, de ugyanez a kód fut le minden forgatókönyvben. A különbség annyi, hogy az egyes forgatókönyvek kicsit másképp lehetnek beállítva, vagy a kapott függvények (function) kicsit mást adhatnak vissza attól függően, éppen melyik forgatókönyvben vagy.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/scenario-buttons.webp"
  alt="A forgatókönyv-gombok sora közvetlenül egy feladat kimenete fölött, bekarikázva, hogy jól látszódjanak"
  width="500"
  height="318"
/>

Vegyünk példaként egy golfjátékot. Lehet, hogy attól függően kell változtatnod, milyen messzire gurul a labda, hogy mit ad vissza a `getShotLength` nevű függvény, amely megmondja, milyen messzire ütötte a golfozó a labdát. Képzeld el, hogy a játékosnak a telefonján kellett húznia egyet ahhoz, hogy megadja, milyen messzire ütött.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/golf-game.webp"
  alt="Egy golfjáték jelenete golfozóval, labdával és a jobb oldali lyukban álló zászlóval"
  width="412"
  height="400"
/>

Az eredményt ezen a függvényen keresztül kapod meg. Az egyik forgatókönyvben tehát meghívod a `getShotLength` függvényt, és az 23-at ad vissza, ami egy kis húzás. Egy másikban 70-et, ami egy hosszú húzás. Egy harmadikban 45-öt. A kódodnak minden forgatókönyvben a megfelelő távolságra kell gurítania a labdát, egyetlen programmal, egyetlen kóddal. A `getShotLength` függvénnyel kell megnézned, milyen messzire ment az ütés, majd odáig gurítanod a labdát.

```javascript
let distance = getShotLength()
```

A forgatókönyvek biztosítják, hogy a kódod tényleg rendesen működjön. Olyan kódot írni, amely egyetlen konkrét helyzetben működik, elég könnyű. Olyat írni, amely sokféle helyzetben is megállja a helyét, sokkal nehezebb, és sokkal értékesebb is. Amikor egy feladatot oldasz meg, kezdd az első forgatókönyvvel. Érd el, hogy az működjön. Utána lépj tovább a következőre, és azt is hozd működésbe. Ha a kódod egy másik forgatókönyvben már nem működik, gondold végig, mi a különbség, és hogyan kell a kódodnak alkalmazkodnia.
