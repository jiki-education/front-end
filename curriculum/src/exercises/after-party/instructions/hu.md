---
title: "After Party"
description: "Derítsd ki, hány vendéget hozhat magával egy híresség, két egymáshoz igazodó lista alapján."
en_md5: c31c0988af324530b986262f47d9a745
---

Újra kidobóembert játszunk. De ezúttal a legnagyobb hírességekkel van dolgunk az After Partyn.

Amikor ezek az emberek megérkeznek a partira, elvárják, hogy pusztán a keresztnevük alapján ismerd őket. Brad Pitt nem fogja az idejét vesztegetni azzal, hogy elmondja a vezetéknevét, csak annyit mond: „Brad”, aztán úgy néz rád, mintha te lennél a kínos.

Ma este két lista van a vágólapodon. Az első a `names`, a meghívottak teljes neveivel. A második a `plusOnes`, hogy hány extra embert hozhat magával minden vendég (a plusz egyeik (_plus-ones_ angolul)). A két lista együtt, tételről tételre, ugyanabban a sorrendben készült, tehát egymáshoz igazodnak. Például a names lista harmadik eleme ugyanahhoz a személyhez tartozik, mint a plusOnes lista harmadik eleme.

Írj egy `plusOnesFor` (plusz egyek lekérdezése) nevű függvényt. A függvénynek három bemenete van: a `names` lista, a `plusOnes` lista, és annak a **keresztneve**, aki éppen előtted áll. A függvény adja vissza, hogy az illető hány extra vendéget hozhat magával.

De légy óvatos! Sor képződik, és ezek az emberek nem csendben sorakoznak. A „Brad” Brad Pittet jelenti, nem Bradley Coopert. És egy-két vendég annyira híres, hogy teljesen elhagyták a vezetéknevüket.

Néhány vendég meg van hívva, de nem hozhat magával senkit, így a `0` teljesen jó válasz egy olyan névre, amely szerepel a listán. Akit viszont egyáltalán nem hívtak meg, az teljesen más eset, és számukra a `"Not on the list!"` sztringet kell visszaadnod, pontosan így.

### Tömb metódusok és tulajdonságok

A stringekhez hasonlóan a tömböknek is vannak metódusaik és tulajdonságaik. Ebben a feladatban jó, ha a `.length` tulajdonságot használod. Pontosan ugyanúgy működik, mint a stringes változat, azzal a különbséggel, hogy most azt mondja meg, hány eleme van a tömbnek, nem pedig azt, hogy hány betűből áll a string. Például:

```js
["Jeremy", "Erik", "Aron"].length
// 3
```

Jó szórakozást!
