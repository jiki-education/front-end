---
title: "A repeat ciklus"
description: "A `repeat` kulcsszóval megmondjuk Jikinek, hogy a kapcsos zárójelek közötti kódot hányszor futtassa le."
en_md5: fbe12c5f92a23c394b6b04d3161cb1a2
---

Eddig minden kódunk lineáris volt: Jiki minden utasítást sorban, fentről lefelé hajtott végre.

Most azt nézzük meg, hogyan léphet ki Jiki ebből a szigorú, fentről lefelé haladó rendből, pontosabban azt, hogyan mondhatjuk meg neki, hogy ugyanazt a kódrészletet többször egymás után futtassa le.

Képzeld el például, hogy a labirintusban vagy, és 10 lépést szeretnél előre menni. Ebben segítene a walk függvény (function), de mi lenne, ha az nem létezne? Mi lenne, ha csak a move függvényed volna?

Ahelyett, hogy tízszer egymás után leírnánk, hogy move (ami elég fárasztó), arra van szükségünk, hogy azt mondhassuk: „Hé, Jiki, amit most mondok, azt csináld meg tízszer!

Move."

Ehhez a kódban az első kulcsszavunkat (keyword) kell használnunk. A kulcsszavak olyan utasítások, amelyeket Jiki magától megért. Kicsit úgy néznek ki, mint a gépek, de nem azok. Amikor Jiki meglát egy kulcsszót, nem keres hozzá gépet a polcon, hanem egyszerűen tudja, mit kell tennie. Ez be van építve az agyába. A kurzus során nagyjából 20 különböző kulcsszót fogunk megtanulni, és az első közülük a repeat.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki kulcsszavakkal körülvéve (repeat, if, else, and, or), mellette a megjegyzés, hogy a kulcsszavak olyan utasítások, amelyeket Jiki megért"
  width="358"
  height="400"
/>

A repeat kulcsszó pontosan azt csinálja, amit fent leírtam. Azt mondja Jikinek: „Amit ezután mondok, azt ismételd meg ennyiszer." Nézd meg ezt a kódot. Először a repeat kulcsszóval közöljük Jikivel, hogy valamit többször fog megcsinálni. Utána sima zárójelbe (`()`) írjuk, hányszor szeretnénk, hogy Jiki megismételje a dolgot, majd jönnek ezek a kapcsos zárójelek (`{}`), és a kapcsos zárójelek között van mindaz, amit Jikinek ismételnie kell. Ez a minta egyébként hihetetlenül gyakori a programozásban: megadunk egy kulcsszót, általában valamilyen információval (itt éppen azzal, hányszor csináljon meg valamit), utána pedig egy kódblokkot kapcsos zárójelek között. Visszatérve a labirintushoz: ahelyett, hogy leírnánk, hogy move, move, move, move, azt írhatjuk, hogy négyszer ismételje meg a move-ot.

```javascript
repeat(4) {
  move()
}
```

Jiki meglátja ezt a kódot, és négyszer egymás után használja majd a move gépet.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki négyszer egymás után használja a move gépet"
  width="421"
  height="400"
/>

És nem csak egyetlen dolgot tehetünk a kapcsos zárójelek közé. Jiki több dolgot is tud ismételten csinálni. Mondhatjuk neki, hogy lépjen egyet, aztán forduljon balra, és ezt az egészet ismételje meg négyszer. Ha Jiki ezt látja, használja a move gépet, aztán a turnLeft gépet, aztán a move gépet, aztán a turnLeft gépet, és így tovább, amíg mindkettőt meg nem csinálta négyszer.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki a move gépet, majd a turnLeft gépet használja, és ezt a két lépést négyszer ismétli meg"
  width="500"
  height="390"
/>

Ezeket az ismétlő utasításokat ciklusnak (loop) hívjuk, és sokféle ciklus létezik, amelyek mind egy kicsit másképp működnek.

Még egy dolgot érdemes tudni: amikor ciklusokkal dolgozol, elengedhetetlen, hogy a kódod rendezett és áttekinthető maradjon. Ha a kódodnak jó a vizuális szerkezete, ránézésre látszik, mi történik benne. Ha viszont nem, ha elfelejted szépen behúzni a sorokat, vagy összevissza húzod be őket, minden nagyon gyorsan zavarossá válik. Ezért ebben a kurzusban mindig egy szabályt követünk. A nyitó kapcsos zárójelet mindig ugyanabba a sorba írod, mint a repeat utasítást. A záró kapcsos zárójelet mindig külön sorba írod az utasítás után, a köztük lévő kódot pedig mindig két szóközzel húzod be. Így minden szépen rendezett marad, és ha ezt elfelejted, vagy más mintát próbálsz követni, hibát kapsz.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki a behúzásra és az új sorra mutat, amelyek rendezetten tartják a ciklus kódblokkját"
  width="500"
  height="398"
/>
