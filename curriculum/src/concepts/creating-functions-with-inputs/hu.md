---
title: "Bemenetek hozzáadása a függvényekhez"
description: "Bemeneti nyílások hozzáadása a saját függvényeidhez, hogy a kapott értékektől függően mást és mást csinálhassanak."
en_md5: c56219cc98b181e94723b43da9f86c87
---

Az eddig elkészített függvényeid mindig pontosan ugyanazt csinálják. A `turnAround` (fordulj meg) mindig kétszer fordul balra. A `shootIfAlienAbove` (lőj, ha fölötted űrlény van) mindig ellenőriz és lő.

De gondolj azokra a függvényekre, amelyeket a kurzus során végig használtál: azok a bemeneteiktől függően mást és mást csinálnak. A Rectangle bemenetként kap egy bal oldali pozíciót, egy felsőt, egy szélességet és egy magasságot, és attól függően rajzol más és más téglalapot, hogy mit adsz meg neki.

Most a saját függvényeidhez is hozzáadunk bemeneti nyílásokat.

Ehhez két dolgot kell tudnod. Az első az, hogy ez hogyan néz ki, mit kell leírnod. A második az, hogy közben valójában mi történik.

Az első rész egészen egyszerű. Csak leírsz egy sima zárójelet, bele pedig a kívánt bemenetek neveit.

Képzeljük el, hogy egy olyan függvényt készítünk, amelyiknek sokszor kell lőnie. Nevezzük `shootMany`-nek (lőj sokszor).

Leírjuk: `function shootMany(numShots) {`, kapcsos zárójelek, aztán jön a kód.

```javascript
function shootMany(numShots) {
  // ...
}
```

Amikor használni akarod ezt a függvényt, azt írod, hogy `shootMany(5)`, ha ötször akarsz lőni, vagy azt, hogy `shootMany(2)`, ha kétszer.

```javascript
shootMany(5)
shootMany(2)
```

És most jön a lényeg. Amikor a kód lefut, bármit adsz is meg ebben a bemenetben, `5`-öt vagy `2`-t, a függvényen belül a kalapos mini-Jiki fogja ezt a bemenetet, beleteszi egy `numShots` (a lövések száma) nevű dobozba, a dobozt pedig felteszi a függvényen belüli polcokra, hogy a függvény kódjában használni tudd.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="Mini-Jiki a shootMany gép belsejében a bemenetet egy numShots feliratú dobozba teszi"
  width="500"
  height="376"
/>

Elmondom még egyszer.

Amikor a függvény használatához leírjuk, hogy `shootMany(5)`, a kinti Jiki fog egy `5`-öst, és beteszi a `shootMany` bemeneti nyílásába. A gépen belül mini-Jiki kiveszi ezt az `5`-öst, és beleteszi egy `numShots` nevű dobozba, mert te ezt a nevet adtad annak a bemeneti nyílásnak. A dobozt aztán felteszi a polcokra, a gépben lévő függvény belsejében.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="Mini-Jiki a numShots dobozt a shootMany gép belsejében lévő polcokra teszi"
  width="500"
  height="302"
/>

A függvényen belül pedig a `numShots` dobozt ugyanúgy használhatod, mint bármelyik másik dobozt. A `numShots` névben semmi varázslat nincs. Bárminek elnevezhettük volna. Ez csak egy utasítás mini-Jikinek, hogy a függvényen belül mindig hozzon létre egy ilyen feliratú dobozt, és tegye bele azt, amit abba a nyílásba bedobnak.

És ha egyszer érték van abban a dobozban, bármit megtehetsz vele, amit dobozokkal amúgy is szoktál. Használhatod például a `numShots` dobozt egy `repeat` ciklus részeként, hogy pontosan a megfelelő számú lövést add le. Ráadásul egynél több bemeneted is lehet. Csak válaszd el őket vesszővel. Ha tehát van egy `drawStar` (rajzolj csillagot) nevű függvényünk, amely a bal felső sarkának pozíciója alapján rajzol egy csillagot, azt írnád: `function drawStar(left, top) {`, kapcsos zárójelek, majd a kódod.

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="A drawStar gép két bemeneti nyílással, két külön értéket fogad"
  width="453"
  height="400"
/>

Amikor pedig a függvényt meghívod, mini-Jiki egyszerűen `left` (bal) és `top` (felső) nevű dobozokba teszi a bemenetekbe adott értékeket, és felteszi őket a függvényen belüli polcokra.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="Mini-Jiki a két bemenetet left és top feliratú dobozokban a drawStar gép belsejében lévő polcokra teszi"
  width="431"
  height="400"
/>
