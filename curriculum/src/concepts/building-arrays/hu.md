---
title: "Tömbök építése"
description: "Egy üres tömbből indulunk, és a `push` segítségével egyesével adjuk hozzá az elemeket, miközben végigmegyünk az adatokon."
en_md5: 73d3d1ac600568692955c90bc5e2945d
---

Eddig olyan tömbökkel (array) dolgoztál, amelyeknek az értéke az elején rögzült, és utána nem változott. De mi van akkor, ha idővel új dolgokat szeretnél hozzáadni egy tömbhöz? Nos, erre való a tömbök `push` nevű metódusa (method).

A `push`-nak egy bemenete (input) van: az a dolog, amit a tömb végéhez szeretnél fűzni. Ebben az esetben az Isaac szót szeretnénk egy olyan tömb végére tenni, amelyben már benne van DJ és Bethany.

Ehhez Jiki kiveszi a tömböt a dobozból, a lánc végére fűzi Isaacet, majd az egészet visszateszi a dobozba. Figyeld meg, hogy a stringekkel (karakterláncokkal) ellentétben, ahol Jiki minden alkalommal új stringet hozott létre, itt magát a tömböt változtatja meg.

Van egy minta, amivel a programozásban gyakran találkozol majd: egy üres tömbből indulsz, és fokozatosan építed fel. Képzeld el, hogy van egy nagy névsorunk, és végig szeretnénk menni rajta. Valahányszor mentort találunk benne, hozzáadjuk a tömbünkhöz.

Ezt a mintát, a ciklussal (loop) való végigmenést és a közbeni hozzáadást, nagyon sokszor fogod még használni.
