---
title: "Relációs jelzőlámpák"
description: "Építsd újra a jelzőlámpádat úgy, hogy minden együtt skálázódjon."
en_md5: d54633094a8d14f73b298fe4827504c4
---

Újra itt vagy a jelzőlámpákkal! Ezúttal az előző két feladat mintáját követve építjük meg a jelzőlámpákat úgy, hogy amikor megváltoztatjuk a sugarat, minden helyesen átméreteződjön. Ehhez van egy sor változónk, amiket beállíthatunk úgy, hogy a `center` (középpont) vagy a `radius` (sugár) valamelyikéhez (vagy mindkettőhöz) viszonyítva legyenek megadva.

<img src="/static/images/exercise-assets/relational-traffic-lights/target.webp" alt="Cél jelzőlámpa" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### A működése

- A rajzvászon bal felső sarka `0,0`. A jobb alsó `100,100`.
- A színváltozók és a `center` rögzítettek számodra. A `radius` alapértelmezetten 10, de megváltoztathatod, és kísérletezhetsz vele.
- Az összes pozíció- és méretváltozót a `radius` és/vagy a `center` valamilyen kombinációjaként kell kiszámítanod.
- A burkolat egy téglalap, ami körülveszi mind a három fényt, térközzel. A térköz megegyezik a sugárral.
- A három fény függőlegesen egyenletesen oszlik el a burkolaton belül, és a burkolat a kép közepén van. (Tehát a sárga kör középpontja a kép középpontja.)

### Származtatandó változók

Az összes változónak a `radius` vagy a `center` valamilyen felhasználásával kell megadva lennie (például `radius * 7` vagy `center - (radius * 2)`)

- `redY` (a piros fény függőleges középpontja), `yellowY` (a sárgáé), `greenY` (a zöldé) — az egyes fények függőleges középpontjai
- `housingX` (a burkolat bal felső sarkának x koordinátája), `housingY` (a burkolat bal felső sarkának y koordinátája) — a burkolat bal felső sarka
- `housingWidth` (a burkolat szélessége), `housingHeight` (a burkolat magassága) — a burkolat mérete

### A reszponzivitás tesztelése

Munka közben a sugarat `2` - `12` között változtathatod, hogy megnézd, minden helyesen skálázódik-e. Ha jól írtad meg a kódot, minden szépen skálázódik a kép középpontja körül!
