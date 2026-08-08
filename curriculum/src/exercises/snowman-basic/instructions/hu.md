---
title: "Snowman"
description: "Építs hóembert három körből."
en_md5: b8c4b86ef84ef659b9e869fa6504c672
---

Ez a gyakorlat bemutatja a `circle` függvényt, amit 3 bemenettel (_inputs_ angolul) használunk:

- `\`centerX\`` (vízszintes középpont): A kör középpontjának vízszintes (x) pozíciója
- `\`centerY\`` (függőleges középpont): A kör középpontjának függőleges (y) pozíciója
- `\`radius\`` (sugár): A kör mérete

Ez a kép segít megérteni:

<img src="/static/images/exercise-assets/snowman-basic/intro-circle.webp" alt="Hóember" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Hóember rajzolása

A feladatod, hogy három fehér körből építs egy hóembert. A hóember részei:

- Egy nagy **alap** kör alul
- Egy közepes **test** kör középen
- Egy kis **fej** kör felül

Mindhárom körnek vízszintesen középre kell esnie a vásznon. Használd útmutatóként a célképet.

Ahogy korábban is, egy 100 egység széles és 100 egység magas vászonra rajzolsz. Tehát a vászon bal felső sarka `0,0`, a jobb alsó sarka `100,100`, és az egérrel a vászon fölé állva ellenőrizheted, hová kell kerülnie valaminek. Hogy megkönnyítsük a dolgodat, ebben a gyakorlatban minden szám **osztható 5-tel**.
