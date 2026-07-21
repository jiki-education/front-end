---
title: "Repeat szám nélkül"
description: "A repeat ciklus zárójelét üresen hagyjuk, így Jiki addig megy tovább, amíg valami más meg nem állítja."
en_md5: cb1ecfefe2f9bb053d86e25ffd41a327
---

Eddig, amikor a repeat ciklust (loop) használtad, mindig megadtál egy számot, ami megmondta, hányszor ismételjen. Ismételj ötször, 10-szer, 40-szer. Néha erre változót (variable) is használtál. De mindig pontosan megmondtad Jikinek, hányszor fusson le a ciklus. Csakhogy néha előre nem tudjuk, hányszor kell ismételni. Gondolj a labirintusra. Még a kurzus legelején úgy oldottad meg a labirintust, hogy egyesével leírtad a lépéseket. Láttad a labirintust, megszámoltad a lépéseket, és pontosan a megfelelő számú mozdulatot írtad le.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="Egy labirintus, ahol a szereplő látja az utat, meg tudja számolni a lépéseket, és pontosan le tudja írni a megfelelő mozdulatokat"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

De mi lenne, ha azt mondanám: „Írj nekem olyan kódot, ami bármelyik labirintust megoldja!"? Ahhoz a labirintushoz lehet, hogy 10 lépés kell, lehet, hogy 50 vagy 200. Előre fogalmad sincs.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Több különböző alakú és méretű labirintus, Jiki pedig azon töpreng, hogyan oldhatná meg bármelyiket"
  width="402"
  height="400"
/>

Szóval kell egy mód arra, hogy Jikinek egyszerűen azt mondd: menjen tovább. Nézze meg újra és újra, merre lehet menni, hozzon döntéseket, lépjen előre, egészen addig, amíg célba nem ér.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki egy futópadon fut, és csak megy tovább, újra és újra"
  width="428"
  height="400"
/>

És ezt megoldani igazán egyszerű. Egyszerűen ne adj számot a repeat kulcsszónak (keyword). Hagyd üresen azt a zárójelet. Ha így teszel, Jiki addig megy tovább, amíg valami más meg nem állítja. Hogy mik ezek a „valami mások", azt később nézzük meg. Egyelőre annyi a lényeg, hogy Jiki addig megy, amíg a feladat véget nem ér, vagy amíg úgy nem érzi, hogy már rettentő régóta megy, ráférne egy kis pihenés, és mára elege van.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki kimerülten roskad a futópadra, miután nagyon sokáig ment; kész feladni és pihenni egyet"
  width="500"
  height="378"
/>
