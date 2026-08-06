---
title: "Szivárványgolyó"
description: "Hozz létre egy pattogó labdát, amely szivárványnyomot hagy a vásznon."
en_md5: 501aa30e85d8fceb38890c72be4a0b87
---

A feladatod egy olyan labda létrehozása, amely véletlenszerűen pattog a vásznon, és szivárványt rajzol maga után.

Valahogy így kell kinéznie:

<img src="/static/images/exercise-assets/rainbow-ball/example.gif" alt="Animált szivárványgolyó, amely a vásznon pattog, és színes nyomot hagy maga után" style="width: 100%; max-width: 200px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

A feladat részeként rendelkezésedre áll a `Math.randomInt(min, max)` (véletlenszerű egész szám) függvény, amely egy véletlenszerű egész számot ad vissza a megadott `min` és `max` között.

Szánj néhány percet arra, hogy végiggondold, hogyan oldhatnád meg. Ez a feladat legértékesebb része, ezért ne siess, és **írd le az ötleteidet, mielőtt elolvasod az alábbi képletet.**

Ha már van egy megközelítési ötleted, olvass tovább. De ne olvass tovább, amíg nem gondolkodtál rajta egy darabig!

## A képlet

Ebben a projektben olyan változókról van szó, amelyek a labda helyzetéért felelősek, és folyamatosan nőnek vagy csökkennek. Valamint más változók, amelyek szabályozzák, **hogyan** mozog a labda, és bizonyos feltételek teljesülésekor változnak.

### Rajzolás

- Az első kört, amit rajzolsz, a `(5, 5)` pontba kell elhelyezned.
- Minden kör sugara `10` legyen.
- A kör színéhez HSL-t használj, kezdetben `100`-as színárnyalattal (zöld), `80`-as telítettséggel (erős színek) és `50`-es világossággal (közepes fényerő).

### Animálás

- Kezdetben minden iterációban a labdát `2`-vel jobbra és `1`-gyel lefelé mozgasd.
- A színárnyalat minden alkalommal `1`-gyel nőjön, amíg el nem éri a maximumot (`360`), majd kezdjen csökkenni. A telítettséget és a világosságot nem kell változtatni.

### Pattogás

- Amikor a labda eléri a vászon szélét, irányt kell változtatnia. (Ha nem tudod, hogyan csináld, nézd meg a tippeket.)
- A dolgok még izgalmasabbá tétele érdekében a `Math.randomInt(min, max)` függvény segítségével változtasd az irányt. Válassz olyan `min` (minimum) és `max` (maximum) értékeket, amelyek a kívánt animációs stílust adják.

## Az ellenőrzések teljesítéséhez

Ebben a feladatban nagy szabadságot kaptál. Azt ellenőrizzük, hogy:

- Az első néhány kör helyes-e.
- A vászon több mint 80%-a le van-e festve.

Hogy milyen számokkal éred el ezt, az a te döntésed. Valószínűleg egy olyan ismétlődő blokkot szeretnél, amely `500` és `1000` között iterál.

## Bontsuk részekre…

A feladat kulcsa, hogy lépésenként haladj:

1. A labda színe változzon, ahogy mozog.
2. Pattanjon vissza a jobb oldalról.
3. Pattanjon vissza az aljáról.
4. Pattanjon véletlenszerűen.
