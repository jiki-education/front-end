---
title: "Változók frissítése"
description: "Változtasd meg a változó tartalmát a program futása közben, hogy pozíciókat, darabszámokat, pontszámokat és más, menet közben változó értékeket követhess nyomon."
en_md5: b7aa98b3c645878ede60b32c28109aea
---

Eddig, amikor változókat (variable) hoztunk létre, értékeket tettünk dobozokba, és később kivettük őket. Ez nagyon hasznos volt: átláthatóbb lett tőle a kód, és megspórolt nekünk egy csomó fejszámolást. A változók igazi ereje viszont abban rejlik, hogy a program futása közben meg tudjuk változtatni, mi van a dobozban, mi van a változóban. Így hiába futtatjuk ugyanazt a kódrészletet többször, mindig mást csinálhat attól függően, hogy éppen mi van a dobozokban.

Tegyük fel, hogy virágot szeretnénk ültetni egy kertbe. Van egy praktikus plant függvényünk (function), amelynek egyetlen bemenete (input) van: a pozíció, ahová a virágot tenni szeretnénk. Ha tehát a szélétől 10-re szeretnénk virágot ültetni, azt írjuk: plant(10). Szép és egyszerű.

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="Egy kertbe ültetett virág Jiki táblája mellett"
  width="406"
  height="400"
/>

És mi van akkor, ha nyolc virágot szeretnénk ültetni? Írhatnánk azt, hogy plant(10), plant(20), plant(30) és így tovább, de ez elég fárasztó.

Márpedig már tanultunk valamit, ami pont az ilyen fárasztó kódot váltja ki. Használj ciklust (loop)! Használj repeat blokkot! Állítsuk be tehát a pozíciót 10-re, aztán egy repeat blokkban hívjuk meg a plant-et, vagyis használjuk a plant függvényt, nyolcszor.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

Szerinted mi fog történni?

Nos, nyolc virágot fog ültetni, csakhogy mindet ugyanarra a helyre, ami nem igazán az, amit szeretnénk. Álljunk hát meg egy pillanatra, és gondoljuk végig, mit csinál itt Jiki. Készít egy dobozt position címkével. Beletesz 10-et. Aztán tízszer lefuttatja a plant gépet. Minden alkalommal kiveszi az értéket a position dobozból. Az mindig 10, és így mindig ugyanazt a 10-et adja be a gépnek.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki leveszi a polcról a position dobozt, és a benne lévő 10-es értéket a plant gépbe adagolja"
  width="400"
  height="400"
/>

Arra van tehát szükségünk, hogy minden alkalommal egy kicsit odébb lépjünk. Miután elültettünk egy virágot, azt szeretnénk mondani Jikinek, hogy vigye odébb a pozíciót 10-zel, hogy készen álljon a következő virág ültetésére.

Felejtsük el egy pillanatra a kódot: logikailag hogyan néz ki mindez? Ha azt mondom neked: „Ültesd az első virágot 10-hez, a következőt 20-hoz, az utána következőt 30-hoz", honnan tudja az agyad, hogy a következőt 40-hez kell ültetni, az azt követőt pedig 50-hez?

Az agyad azt csinálja, hogy észben tartja az aktuális számot, hozzáad 10-et, majd frissíti ezt a számot a fejedben.

És pontosan ugyanezt megtehetjük kódban is. Ehhez azt mondjuk: „Frissítsd a position dobozt úgy, hogy az aktuális pozícióérték plusz 10 legyen benne."

Amikor Jiki ezt meglátja, kiveszi az aktuális számot a position dobozból, hozzáad 10-et, elvégzi a matekot, összeadja a kettőt, majd az eredményt visszateszi a dobozba a következő alkalomra.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki kiveszi a 10-et a position dobozból, hozzáad 10-et, így 20 lesz, majd a 20-at visszateszi a dobozba"
  width="427"
  height="400"
/>

Ha ezt beépítjük a programunkba, vagyis azt mondjuk: „A pozíció kezdőértéke legyen 10", aztán nyolcszor ültetünk egy virágot a pozíciónál, majd a pozíciót 10-zel nagyobbra állítjuk, mint előtte volt, a kódunk működik, és nyolc, szépen elosztott virágot kapunk.

Figyeld meg, hogy nincs `let`, amikor a változót frissítjük. Ez nagyon fontos. Amikor Jiki egy let-et lát, új dobozt készít. Itt viszont nem új dobozt akarunk készíteni, hanem azt akarjuk megváltoztatni, ami a már meglévő dobozunkban van.

Azt is vedd észre, hogy a dobozt csak egyszer, a cikluson kívül hozzuk létre. Ezt fontos megjegyezni. A dobozt egyszer, az elején hozod létre, aztán a ciklus minden futásakor frissíted.

Meg tudjuk változtatni, mi van a dobozokban, és ezzel az erővel nyomon követhetünk valamit, ami idővel változik. Ezt a mintát folyamatosan használni fogod: pozíciót követsz, megszámolod, hányszor történt meg valami, pontszámot vezetsz. Amikor csak olyasmit kell megjegyezned, ami a program futása közben változik, ezt így csinálod.
