---
title: "Pingvin"
description: "Fejezd be a szimmetrikus pingvinrajzot."
en_md5: bff370c28fd178d8c0ac9f65e3384e81
---

Ebben a feladatban először rajzolunk ellipsziseket, és egy kicsit továbbgondoljuk a szimmetriát, amiről a Rókafejben már volt szó.

Ez a feladat ellipsziseket használ. Az ellipszis olyan, mint egy kinyújtott kör. A középpontot itt is megadjuk, de egy sugár helyett kettőt használunk – a vízszintes sugarat és a függőleges sugarat. Ha a függőleges sugár nagyobb, mint a vízszintes, az ellipszis magasnak tűnik. Ha pedig a vízszintes sugár nagyobb, mint a függőleges, az ellipszis lapos. Ha mindkét sugarat ugyanakkorára állítod, újra egy kört kapsz!

Az `ellipse` (ellipszis) függvény 5 bemenetet vár: a középpont pozícióját (`centerX` – a középpont x koordinátája, `centerY` – a középpont y koordinátája), a vízszintes sugarat (`radiusX` – a vízszintes sugár), a függőleges sugarat (`radiusY` – a függőleges sugár) és a színt:

<img src="/static/images/exercise-assets/penguin/intro-ellipse.webp" alt="Az `ellipse` függvény diagramja" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### A pingvin

A feladatod, hogy megrajzold a pingvin jobb oldalát, éspedig **ANÉLKÜL**, hogy az egérrel a koordináták fölé mennél, vagy találgatnál. Az elkészült rajznak így kell kinéznie:

<img src="/static/images/exercise-assets/penguin/penguin-finished.webp" alt="Pingvin" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

A kép egyik felét már megrajzoltuk neked. A meglévő kódot olvasva ki kell tudnod találni a többi részletet, hogy szimmetrikus legyen. Ne feledd: a rajzvászon bal felső sarka a `0,0` pont, a jobb alsó sarka a `100,100`. A pingvin középen ül. Az orrhoz a háromszög középső koordinátáit kell **megváltoztatnod**, ne vegyél fel új háromszöget.

**Kezdd a „Kód futtatása” gomb megnyomásával**, hogy lásd, hogyan néz ki a kezdő kép. Jó szórakozást!
