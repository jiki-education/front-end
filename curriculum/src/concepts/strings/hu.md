---
title: "Stringek"
description: "Idézőjelek közé tett szövegdarabok (egy betű, egy szó, egy mondat vagy akár egy egész bekezdés), amelyeket Jiki papírra ír."
en_md5: 51b25294f1e2b465e91096a5d98413d4
---

Amikor egy számot szeretnél használni, egyszerűen csak leírod, és Jiki tudja, mire gondolsz. De mi a helyzet akkor, ha egy betűt, egy szót vagy egy mondatot szeretnél használni? Például mi lenne, ha a téglalap- vagy a kör-függvénynek lenne egy plusz bemenete, amelyben a színt adod meg? Hogyan írnánk le a színt, hogy a gépbe tehessük? Ha egyszerűen csak leírjuk, hogy green vagy blue, Jiki azt hiszi, hogy egy polcon lévő gépre gondolunk, és azt mondja: „Nincs green nevű gép. Nem tudom, mit csináljak."

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki zavartan áll a téglalap-gép mellett, a feje fölött kérdőjelekkel"
  width="446"
  height="400"
/>

Ezért van egy szabályunk: amikor szöveget akarunk használni, idézőjelek közé kell tennünk, méghozzá dupla idézőjelek közé. És amikor valamit így idézőjelek közé teszel, Jiki elővesz egy papírlapot, és felírja rá azt, amit az idézőjelek közé írtál. Ezeket a papírlapokat hívjuk stringeknek (magyarul karakterláncnak).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki felírja a green szót egy papírlapra, amelyből string lesz"
  width="398"
  height="400"
/>

Egy string lehet egyetlen betű, egy szó, egy mondat, egy bekezdés, de akár egy egész könyv is. A szabály egyszerű: ha szöveg, akkor idézőjelek közé tesszük, és string lesz belőle.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Egy tábla különböző hosszúságú, idézőjelek közé tett stringekkel: egyetlen betű, egy szó, egy mondat és egy többsoros cím"
  width="500"
  height="398"
/>

Ha tehát kék téglalapot szeretnénk, leírjuk a számokat: a bal oldali pozícióját, a felső pozícióját, a szélességét és a magasságát. Az ötödik bemenethez viszont idézőjelek között írjuk be, hogy blue.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki leveszi a gépet a polcról, és az első négy nyílásba érméket dob. Aztán felírja egy papírlapra, hogy blue, a papírt az ötödik nyílásba teszi, és elindítja a gépet.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki a kék papírt a téglalap-gép ötödik nyílásába teszi, az első négy nyílásban a 10, 20, 30 és 40 érmékkel"
  width="500"
  height="392"
/>

A string egyike azoknak a szakszavaknak, amelyektől elsőre sokan megijednek, pedig valójában csak annyit jelent: szöveg. Nagyon hamar megszokod majd. Semmi varázslat nincs benne.
