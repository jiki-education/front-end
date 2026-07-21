---
title: "Ciklus a ciklusban"
description: "Az egyik ciklust a másikba tesszük, így a belső ciklus a külső ciklus minden lépésénél teljesen lefut. Rácsokhoz ez tökéletes."
en_md5: 649e59c4bf97f57841f7d85390dff519
---

Tegyük fel, hogy egy sor virágot szeretnénk. Írhatunk valami ilyesmit. Beállítunk egy pozíciót, elültetünk egy virágot, a pozíciót megnöveljük 10-zel, ezt ismételgetjük, és a végén egy szép, egyenes virágsort kapunk.

```javascript
let x = 10
repeat(5) {
  plant(x, 50, 10)
  x = x + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/single-row-flowers.webp"
  alt="Jiki egy táblánál, alatta egyetlen takaros virágsor"
  width="406"
  height="400"
/>

De mi van akkor, ha egy egész virágrácsot szeretnénk, sorokkal és oszlopokkal? Mondjuk négy sort, soronként öt virággal.

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/grid-question.webp"
  alt="Egy négyszer ötös virágrács, Jiki pedig azon gondolkodik, hogyan rajzolja meg"
  width="383"
  height="400"
/>

Van egy ciklusunk (loop), amely egy sor virágot rajzol. Hogyan tudnád ezt felhasználni négy sor megrajzolásához? Vagy mit tehetnénk, hogy négy sort kapjunk?

Az egyik lehetőség az lenne, hogy ezt a ciklust négyszer bemásoljuk, és mindegyiknél átírjuk a felső pozíciót. Ez működne is. Nem lenne vele semmi baj. Csakhogy ismétlődő, és van jobb megoldás is. Tudjuk, hogy ha a kód ismétlődik, egy ciklussal egyszerűsíthetünk rajta.

Itt tehát az egyik ciklust egy másik ciklusban használhatjuk. Az egyik ciklus a sorokért felel, a másik az adott sor virágaiért. Kezdésként tegyünk egy `repeat` ciklust a meglévő kódunk köré, hogy ráérezz a dologra. Egyelőre csak egyszer ismétlünk. Vagyis azt mondjuk Jikinek, hogy mindazt, ami ezek között a külső kapcsos zárójelek között van, hajtsa végre egyszer. Ennek pontosan ugyanaz a hatása, mintha ez a külső ciklus ott sem lenne. Azt mondjuk Jikinek, hogy ismételjen meg valamit egyszer, ami ugyanaz, mintha `repeat` nélkül kérnénk tőle. De ez a kód így működik. Teljesen szabályos, érvényes kód. Egy ciklus van egy másik ciklusban.

Na és mi történik, ha a külső ciklust kétszeri ismétlésre állítjuk? Ilyenkor Jiki az egész „ültess ötször” részt kétszer futtatja le. Tíz virágot ültet el. Csakhogy ezek a virágok mind ugyanabban a sorban lesznek.

Ahogy a pozíciót minden ültetés után egy kicsit balról jobbra kellett vinnünk, ugyanúgy minden teljes sor megrajzolása után a függőleges pozíciót is odébb kell tolnunk. Hogyan csináljuk ezt? Felvehetünk egy külső változót (variable) a felső pozíciónak, azt használjuk a `plant` függvényben (function), és minden sor után megnöveljük 10-zel.

Gondold végig, mennyi az érték az egyes lépéseknél. A felső pozíció 10-ről indul. Az első öt ültetésnél ez nem változik, a bal oldali pozíció viszont nő. Aztán ehhez a felső pozícióhoz hozzáadunk még 10-et, és kicsit lejjebb elültetünk újabb öt virágot. A bal oldali pozíciót visszaállítjuk 10-re, majd megint lépésenként növeljük.

Most pedig mondhatjuk azt, hogy ismételd ezt négyszer, és négy sort kapunk, soronként öt növénnyel.

```javascript
let y = 10
repeat(4) {
  let x = 10
  repeat(5) {
    plant(x, y, 10)
    x = x + 10
  }
  y = y + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/flower-grid-result.webp"
  alt="A kész négyszer ötös virágrács, mellette a boldog Jiki két felfelé mutatott hüvelykujjal"
  width="389"
  height="400"
/>

A legfontosabb, amit meg kell értened, az, hogy Jiki előbb a belső ciklus összes munkáját befejezi, és csak utána tér vissza a külső ciklushoz. Nem ugrál ide-oda a kettő között. Végigcsinálja a belső ciklust, aztán lép tovább a külső ciklus következő lépésére.

Ebben a helyzetben úgy gondolhatsz a külső ciklusra, mint ami a csoportokat, vagyis a sorokat vezérli, a belső ciklusra pedig úgy, mint ami a csoport egyes elemeit, vagyis az adott sor egyes darabjait kezeli. A példánkban tehát a külső ciklus négy sort készít, a belső ciklus pedig öt növényt, öt elemet tesz minden csoportba.
