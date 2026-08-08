---
title: "Szivárvány"
description: "Fess szivárványt 100 színes függőleges sávból."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

A feladatod egy gyönyörű szivárványminta megrajzolása 100 függőleges sávból. Így kell kinéznie:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Szivárvány" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

A szivárvány `100` sávból áll, mindegyik fentről lefelé fut, és `1` a szélessége. Az első sáv `x` (vízszintes pozíció) értéke `0` legyen, az utolsóé pedig `99`.

A szín beállításához használd a `hsl(...)` (színárnyalat, telítettség, világosság) függvényt. Ez egy színt leíró stringet ad vissza (_return_ angolul), amit aztán a `rectangle(...)` (téglalap) utolsó bemeneteként használhatsz. A telítettség (_saturation_ angolul) és a világosság (_lightness_ angolul) értékét a legjobb `50` körülire állítani. Az első sáv **színárnyalata** (_hue_ angolul) `0` legyen. A színárnyalat sávról sávra növekedjen, és a végére érjen valahova 300 közelébe.
