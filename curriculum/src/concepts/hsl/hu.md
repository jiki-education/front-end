---
title: "HSL színek"
description: "Színek felépítése színárnyalatból (az árnyalat, 0–360), telítettségből (mennyire élénk, 0–100) és világosságból (mennyire fényes, 0–100)."
en_md5: ea9405f74e8608a50deedb8399a11971
---

A HSL egészen másképp közelíti meg a színeket, mint az RGB. A HSL a színárnyalat (_hue (H)_ angolul), a telítettség (_saturation (S)_ angolul) és a világosság (_lightness (L)_ angolul) szavak rövidítése. Van egy `hsl` nevű függvényed, amely három számot vár: egyet a színárnyalathoz, egyet a telítettséghez és egyet a világossághoz, és egy színt ad vissza. Nézzük meg, mit is jelent ez a három szó.

```javascript
hsl(hue, saturation, lightness)
```

A színárnyalat azt adja meg, milyen színt szeretnél, és nullától 360-ig terjed. Képzelj el egy szivárványt. Én így szoktam rá gondolni. Bal oldalon a piros van, utána jön a narancs, a sárga, a zöld, a kék, a lila, és a végén visszaérünk a piroshoz. Ha tehát nullát adsz meg, a bal szélről indulsz, az a piros. Ha `120`-at mondasz, zöldet kérsz. A `230` a kék. Gondolhatsz erre színkörként is, valójában innen jön a 360: ennyi fok van egy körben. Én mindig egyszerűen kikeresem a számokat, amikre szükségem van, úgyhogy ne izgulj, nem kell ezt bemagolni, de jó tudni, mi zajlik a háttérben. Ez tehát a színárnyalat, vagyis maga az árnyalat. Következik a telítettség, ami azt mutatja, mennyire élénk a szín. Nullától 100-ig terjed. Nullánál csak szürkét kapsz. Nincs benne szín, semmi tónus. 100-nál teljes, élénk, ragyogó színt kapsz. Végül ott a világosság. A világosság azt adja meg, mennyire fényes a szín, és ez is nullától 100-ig terjed. Nullánál feketét kapsz. Bármilyen színárnyalatot választottál is, fekete lesz. Nincs benne fény. 100-nál pedig fehéret kapsz. Bármit állítottál is be máshol, csupa fény az egész, tehát fehér. Az 50 van pont középen, ez a normál szín. Gondolhatsz erre úgy is, mint egy csúszkára, amivel világosabbra vagy sötétebbre állítod a színt.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="Színárnyalat-színkör és szivárvány, amely mutatja, hogy a 0 a piros, a 120 a zöld, a 240 pedig a kék"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="Telítettségcsúszka 0-tól (szürke) 50-en át 100-ig (teljes, élénk szín)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="Világosságcsúszka 0-tól (fekete) 50-en át 100-ig (fehér)"
  width="500"
  height="398"
/>

Ha tehát egy normál piros kört szeretnénk, amit RGB-vel 255, nulla, nullaként írtunk volna le (csupa piros, semmi zöld, semmi kék), itt a nulla, 100, 50 értékeket használnánk. Nulla a piros színárnyalathoz, 100 a telítettséghez, vagyis teljes szín, és 50 a világossághoz, ami a normál fényerő. Ha zöld kört akarunk belőle csinálni, elég a színárnyalatot `120`-ra átírni. Ha sötétebb zöldet szeretnénk, csökkentsük a világosságot `25`-re.

```javascript
hsl(0, 100, 50)
hsl(120, 100, 50)
hsl(120, 100, 25)
```

Ha fakóbb zöldet szeretnénk, kivehetünk belőle egy kis színt, egy kis telítettséget, mondjuk levehetjük `30`-ra.

Ha élénk, rikító rózsaszínt szeretnél, a 300 körüli színárnyalat a rózsaszín, aztán a telítettséget 100-ra emeljük, hogy igazán élénk legyen, és a világosságot is megtoljuk nagyjából 60-ra.

A HSL akkor igazán hasznos, amikor végig akarsz pörögni a színeken. Ha szivárványt szeretnél, elég folyamatosan növelni a színárnyalatot.
