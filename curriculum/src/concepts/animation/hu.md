---
title: "Animáció"
description: "Becsapjuk a szemet: minden képkockánál újrafestjük a hátteret, és kicsit odébb rajzolunk mindent, így mozgásnak látjuk."
en_md5: 536994294072afea52dab51d3bb7cab8
---

Eddig, amikor a `repeat` (ismételd) ciklussal rajzoltunk, minden új rajz hozzáadott valamit a képhez. Ha új téglát rajzoltunk egy falba, az betöltött egy rést. Ha 10 kört rajzoltunk, 10 kört láttunk a képernyőn. Olyan ez, mint egy festmény. Ha egyszer festéket teszel a falra, az nem tűnik el attól, hogy mellé festesz valami újat. Ott marad. De mi van akkor, ha azt szeretnénk, hogy valami mozogni látsszon?

Láttál már pörgetős füzetet? Gyerekkoromban nagyon népszerűek voltak, ma már kevésbé. A pörgetős füzet egy kis füzet, amelynek minden oldalán egy kicsit más rajz van. Ahogy gyorsan végigpörgeted a lapokat, a szemed látja, hogy a rajzok változnak, az agyad pedig azt hiszi, hogy valami mozog. Pedig valójában nem mozog semmi. Csak sok, egymástól kicsit különböző kép követi egymást. És a kódban pontosan így működik az animáció. A trükk ugyanaz. Mielőtt új jelenetet rajzolnánk, az egész vásznat átfestjük egy háttérszínnel, mintha új lapot kezdenénk a pörgetős füzetben, aztán egy kicsit változtatunk a jeleneten, hogy mozgásnak tűnjön.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/flip-book-pages.webp"
  alt="Pörgetős füzet egy futó pálcikaemberrel; minden oldal kicsit más, így az alak mozogni látszik"
  width="500"
  height="274"
/>

Vegyünk egy ismerős kódrészletet, amelyben köröket rajzolunk a képernyőre: beállítunk egy `position` (pozíció) nevű változót, és van egy `repeat` blokkunk, amelyben rajzolunk egy kört, majd a `position` értékét eggyel jobbra toljuk. Ha ezt a `repeat` blokkot 100-szor futtatjuk le, 100 kört fogunk látni a képernyőn.

```javascript
let position = 0
repeat(100) {
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circles-trail.webp"
  alt="100 kék körből álló csík, balról jobbra végigrajzolva a képernyőn"
  width="500"
  height="197"
/>

Most nézd meg, mi történik, ha minden kör elé csupán egyetlen sima téglalapot rajzolunk.

```javascript
let position = 0
repeat(100) {
  rectangle(0, 0, 100, 100, "white")
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

Körökből álló csík helyett a szemünk most egyetlen kört lát, amely mintha végigsiklana a képernyőn.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circle-glide-frames.webp"
  alt="Képkockák sorozata; mindegyik friss fehér vászon egyetlen kék körrel, amely lépésről lépésre jobbra kerül"
  width="500"
  height="187"
/>

A ciklus minden ismétlésénél teljesen új hátteret festünk, eltakarunk mindent, ami addig ott volt, aztán az új helyére rajzoljuk a kört.

A ciklus minden ismétlése olyan, mint egy új lap a pörgetős füzetben.

És itt a legfontosabb, amit meg kell értened: nem a kört mozgatjuk. A kör nem egy tárgy, ami végigcsúszik a képernyőn. Csak egy rajz. A ciklus minden ismétlésénél átfestjük a régi rajzot, és készítünk egy vadonatújat, egy kicsit jobbra. A szemed mindezt összerakja, és mozgást lát, pedig valójában csak sok különálló rajz követi egymást.

Ezt az ötletet akár egy naplemente megrajzolására is használhatod. Mozgathatod a napot, változtathatod a méretét és a színét. A technika mindig ugyanaz: beállítasz néhány változót, festesz egy friss hátteret, és mindent megrajzolsz. Frissíted a változókat, aztán ismételsz.
