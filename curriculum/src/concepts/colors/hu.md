---
title: "Színek"
description: "Két módszer bármilyen szín megadására. Az RGB piros, zöld és kék fényt kever. A HSL az árnyalatot, a telítettséget és a világosságot használja."
en_md5: "305a733d063a1f24c8fec434dd00c8ef"
---

Ha valaha bármi vizuálisat csinálsz kóddal (és még ha adattudós szeretnél is lenni, és a rajzolgatást kicsit unalmasnak tartod, az adatok vizuális bemutatása akkor is kulcsfontosságú készség), kétféleképpen adhatsz meg színeket. Eddig a nevükkel használtad a színeket, például red vagy yellow, a rajzoló függvények (function) utolsó bemeneteként (input). Ez kényelmes módja volt a színek gyors használatának, de elég korlátozott is: csak egy maroknyi névvel ellátott szín létezik, amit használhatunk. Ezért most megnézünk két módszert, amivel bármilyen színt megadhatsz. Ezt a kettőt RGB-nek és HSL-nek hívják.

Az RGB úgy tekint a színekre, mint a piros, a zöld és a kék keverékére. Ezt jelenti az RGB rövidítés: red, green, blue, vagyis piros, zöld, kék. Ha emlékszel az iskolai festékkeverésre, hasonló az ötlet, csak festék helyett fényt keverünk.

Sok feladatban lesz egy RGB nevű függvényed, ami három számot vár bemenetként, egyet a piroshoz, egyet a zöldhöz, egyet a kékhez, és egy színt ad vissza.

A bemenetként használható számok nullától 255-ig terjednek. A nulla azt jelenti, hogy abból a színből semennyit nem kérek, a 255 pedig azt, hogy amennyit csak lehet, keverjünk bele. Ha tehát az RGB függvényt a 255, nulla, nulla bemenetekkel használjuk, azt mondjuk: kérem az összes pirosat. Ne feledd, 255 a legnagyobb szám, amit beírhatsz. Zöldet és kéket viszont egyáltalán nem kérünk, ezért azok nullák. Így pirosat kapunk, ezt a pirosat eltárolhatjuk egy változóban (variable), és utána ugyanúgy használhatjuk a circle függvényben, ahogy eddig a színneveket tartalmazó stringekkel (karakterláncokkal) tettük. Na és mi történik, ha az RGB függvényt a nulla, 255, nulla értékekkel használjuk? Most azt mondjuk: pirosat nem, zöldet mind, kéket nem. Zöld kört kapunk. És ha sárgát szeretnénk? A sárga a piros és a zöld keveréke. Mondhatjuk tehát: kérem az összes pirosat, az összes zöldet, kéket pedig semennyit. Ez sárgát ad. Kisebb számokat is használhatunk. Ha egy kis pirosat kérünk, zöldet nem, kékből pedig sokat, lilát kapunk. Sok piros, egy kevés zöld és valamivel több kék pedig rózsaszínt ad. Ez tehát az RGB: pirosat, zöldet és kéket keverünk különböző kombinációkban.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/rgb-intro.webp"
  alt="Három egymást átfedő kör piros, zöld és kék fényből, amelyek keveredve sárgát, magentát, ciánt és fehéret adnak"
  width="500"
  height="390"
/>

```javascript
let red = rgb(255, 0, 0)
let green = rgb(0, 255, 0)
let yellow = rgb(255, 255, 0)
let pink = rgb(230, 50, 170)
```

Most nézzük a HSL-t, ami egészen másképp közelíti meg a színeket. A HSL a hue, saturation, lightness rövidítése, vagyis árnyalat, telítettség és világosság. Az RGB-hez hasonlóan itt is van egy HSL nevű függvény, ami három számot vár, egyet az árnyalathoz, egyet a telítettséghez, egyet a világossághoz, és egy színt ad vissza. Nézzük meg, mit jelent ez a három szó.

Az árnyalat a szín tónusa, amit szeretnél, és nullától 360-ig terjed. Képzelj el egy szivárványt, én is így szoktam gondolni rá. Bal oldalon a piros van, utána jön a narancs, a sárga, a zöld, a kék, a lila, és végül visszaérünk a piroshoz. Ha tehát nullát adsz meg, a bal szélen kezdesz, az a piros. Ha 120-at, akkor zöldet kérsz. A 230 a kék. Gondolhatsz erre színkörként is, valójában ezt jelenti a 360: a kör fokainak száma. Én mindig egyszerűen kikeresem a számokat, amikre szükségem van, úgyhogy ne aggódj, nem kell mindezt memorizálni, de jó tudni, mi történik a háttérben. Ez tehát az árnyalat, vagyis a szín tónusa. A következő a telítettség, ami azt adja meg, mennyire élénk a szín. Nullától 100-ig terjed. Nullánál csak szürkét kapsz, nincs benne semmi szín, semmi tónus. 100-nál teljes, élénk, ragyogó színt kapsz. Végül ott a világosság. A világosság azt adja meg, mennyire fényes a szín, és szintén nullától 100-ig terjed. Nullánál feketét kapsz, bármilyen árnyalatot választottál is. Nincs benne fény. 100-nál pedig fehéret kapsz, minden mástól függetlenül csupa fény az egész, tehát fehér. Az 50 pont középen van, ez a normál szín. Gondolhatsz erre úgy, mint egy csúszkára, amivel világosabbá vagy sötétebbé teszed a színt.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/hsl-intro.webp"
  alt="Szivárvány és színkör, amelyen az árnyalat 0-tól (piros) 120-on (zöld) át 240-ig (kék) halad"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/saturation-slider.webp"
  alt="Telítettség-csúszka 0-tól (szürke) 50-en át 100-ig (élénk magenta)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/lightness-slider.webp"
  alt="Világosság-csúszka 0-tól (fekete) 50-en (teljes szín) át 100-ig (fehér)"
  width="500"
  height="398"
/>

Ha tehát egy normál piros kört szeretnénk, amit RGB-vel a 255, nulla, nulla számokkal írtunk volna le (az összes piros, se zöld, se kék), itt a nulla, 100, 50 értékeket használnánk. Nulla a piros árnyalathoz, 100 a telítettséghez, vagyis teljes szín, és 50 a világossághoz, ami a normál fényerő. Ha ebből zöld kört akarunk csinálni, elég az árnyalatot 120-ra átírni. Ha sötétebb zöldet szeretnénk, vigyük le a világosságot 25-re.

Ha fakóbb zöldet szeretnénk, vegyünk ki belőle egy kis színt, egy kis telítettséget, mondjuk vigyük le 30-ra.

Ha élénk, harsány rózsaszínt szeretnél, a 300 körüli árnyalat a rózsaszín, a telítettséget felvisszük 100-ra, hogy igazán élénk legyen, és a világosságot is megemeljük nagyjából 60-ra.

```javascript
let red = hsl(0, 100, 50)
let green = hsl(120, 100, 50)
let darkGreen = hsl(120, 100, 25)
let dullGreen = hsl(120, 30, 50)
let hotPink = hsl(300, 100, 60)
```

Két különböző módszerünk van tehát a színek megadására, és más-más helyzetben hasznosak. Az RGB akkor nagyszerű, ha egy adott összetevőt szeretnél állítani: mennyi legyen a piros, mennyi a zöld, mennyi a kék. A HSL akkor nagyszerű, ha végig akarsz lépkedni a színeken. Ha szivárványt szeretnél, elég folyamatosan növelni az árnyalatot.
