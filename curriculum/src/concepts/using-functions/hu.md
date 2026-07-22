---
title: "Függvények használata"
description: "Szólj Jikinek, hogy indítsa el az egyik kis gépét: írd le a nevét, utána a két zárójelet."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Amikor kódot írsz, valójában azt mondod el egy olyan nyelven, amit a számítógép is megért, hogy mit szeretnél, hogy megtörténjen. Rengeteg különböző programozási nyelv létezik, és rengeteg különböző értelmező is, amely a leírt kódot olyan egyesekké és nullákká alakítja, amelyeket a számítógép megért. Ebben a kurzusban a te értelmeződ Jiki. Az egész kurzus róla kapta a nevét. Ő itt Jiki. Jiki lesz a barátod ezen a programozási utazáson. Az ő dolga, hogy értelmezze a kódot, amit írsz, és olyan egyesekké és nullákká alakítsa, amelyekkel a számítógép ténylegesen dolgozni tud.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, a barátságos értelmező, aki végigkísér ezen a kurzuson"
  width="421"
  height="400"
/>

A programozás lényege, hogy a megfelelő utasításokat adjuk az értelmezőnek, jelen esetben Jikinek. Rengeteg különböző utasítást adhatsz Jikinek, nagyon sok mindent megért. Össze tud ragasztani dolgokat, meg tud csinálni valamit sokszor egymás után, és azt is tudja mondani: „Ha ez történik, akkor ezt kell tennem." Meg tud jegyezni dolgokat, és később újra fel tudja használni őket. Ha valami nem stimmel, hibát is tud jelezni. A kurzus során ezekkel mind foglalkozunk majd. A legfontosabb viszont az, hogy bármit is csinálsz majd, lényegében utasításokat írsz fel egy táblára, Jiki pedig jön, és követi őket.

Amikor 34 évvel ezelőtt megtanultam programozni, ezt a gondolati modellt építettem fel magamban, és a mai napig ez van a fejemben. Pontosan értem, hogyan működik a számítógép, egészen az egyesekig és nullákig, de őszintén szólva sosem gondolok erre. A fejemben egy kis ember lakik a számítógépben, és én megmondom neki, mit csináljon. Tarts hát velem ebben. Ez egy erős gondolati modell, amit te is felépíthetsz, és ha elkezdesz ilyen vizuálisan gondolkodni arról, hogy mit csinál a számítógépben lakó emberke, az nagyon jól fog jönni, miközben programozni tanulsz.

Kezdjük is az egyik alapvető programozási fogalommal, a függvényekkel (_functions_ angolul). A függvények olyanok, mint kis gépek, amelyeket Jiki a te utasításodra használ. Ha benézünk Jiki raktárába, ő ott szokott tanyázni, látni fogod, hogy van egy polca három különböző géppel: `move` (mozgás), `turnLeft` (fordulj balra) és `turnRight` (fordulj jobbra).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Egy polc Jiki raktárában, rajta három gép: move, turnLeft és turnRight"
  width="500"
  height="371"
/>

Amikor leírtad, hogy `move`, majd utána a két zárójelet, azzal azt mondtad Jikinek, hogy vegye le a `move` gépet a polcról, tekerje meg a karját, indítsa be, és használja.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki legurítja a move gépet a polcról, hogy használja"
  width="439"
  height="400"
/>

Amikor leírtad, hogy `turnLeft`, majd a zárójeleket, azzal arra utasítottad Jikit, hogy vegye le a `turnLeft` gépet a polcról, és használja azt. Ezt a mintát fogod újra és újra használni. Amikor egy gépet szeretnél használni, leírod a nevét, utána a zárójeleket, és ezzel mondod meg Jikinek, hogy hozza el a gépet, és használja:

```javascript
move()
turnLeft()
```

Hogy egy gép valójában hogyan működik, mi történik a belsejében, azzal most még nem kell foglalkoznunk. Később sokkal részletesebben megnézzük. Sőt, nem kell sokat várnod, és már saját gépeket is építhetsz majd. Egyelőre viszont ne aggódj emiatt. Minden feladatnál megtudod, milyen gépek vannak Jiki polcán. Feladatonként más és más gépek lesznek, és ezekkel tudod majd megoldani a feladatokat.
