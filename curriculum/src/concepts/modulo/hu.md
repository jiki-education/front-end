---
title: "Maradék"
description: "A `%` operátor használata az osztás után megmaradó rész kiszámítására, leggyakrabban annak eldöntésére, hogy egy szám páros vagy páratlan."
en_md5: 1475a3302b40866ecfc83c9bc4127a45
---

Eddig összeadást, kivonást, szorzást és osztást használtunk, amikor számoltunk. Most bevezetünk még egyet: a maradék operátort (remainder operator).

A maradék operátor, ahogy a neve is mutatja, azt adja meg, mennyi a maradék, amikor két számot elosztunk egymással. Egy százalékjellel írjuk le. Ha tehát azt írjuk, hogy `10 % 4`, azt kérdezzük: „Mennyi marad, ha a 10-et elosztjuk 4-gyel?" A válasz: kettő. Képzeld el, hogy van 10 cukorkád vagy mogyoród, és négy ember között szeretnéd egyenlően elosztani. Mindenki kap kettőt, és a végén kettő megmarad. Ez a megmaradt rész a maradék. Ezt adja meg a százalékjel.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="Tíz cukorka egy sorban, négy ember között egyenlően elosztva, kettő maradékként megmarad"
  width="500"
  height="22"
/>

```javascript
10 % 4
```

Az egyik ok, amiért ezt kódban elég gyakran használjuk, az, hogy így megtudhatjuk, hogy valami egyenlően osztható-e. A leggyakoribb minta erre annak eldöntése, hogy egy szám páros vagy páratlan. A páros számok, mint tudod, mind maradék nélkül oszthatók kettővel. A páratlan számoknál mindig egy marad, ha kettővel osztod őket.

Ha veszed a négyet, a hatot vagy a nyolcat, és elosztod őket kettővel, semmi sem marad. Az ötnél, a hétnél és a kilencnél viszont mindig egy marad a végén. Ha tehát azt írjuk, hogy `if something % 2 === 0`, azt kérdezzük: „Páros szám ez a valami?" És ez rengeteg dologhoz jól jöhet. Képzeld el, hogy különböző színű csíkokat rajzolsz, vagy egy sorban állókat osztasz ketté, és a feléd sétáló embereket felváltva küldöd kétfelé.

Még egy dolog: lehet, hogy hallod majd, hogy ezt a maradék operátort modulo operátornak hívják. A modulo és a maradék gyakorlatilag ugyanaz. Van köztük néhány apró különbség, amivel valószínűleg soha nem kell foglalkoznod, úgyhogy egyelőre maradjunk a maradék operátor névnél, mert az sokkal egyszerűbb.
