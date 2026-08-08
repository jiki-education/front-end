---
title: "Hivatalos vacsora"
description: "Keresd ki az ülésrendből, hogy egy vendég melyik asztalnál ül."
en_md5: b93bf1949411dbc2a19e5b48c3ae869a
---

Visszatértél a kidobói mellékállásodba. Az After Party utáni este van, és máris itt a következő összejövetel. Ezúttal egy hivatalos vacsora, úgyhogy ma este kevésbé vagy „ajtóban álló izomember”, mint inkább „egy dossziés, elegáns mellényes személy”.

Itt semmiképp sem elég **csak** a keresztneved használni. Igazából egyáltalán nem itt a helye a keresztnévnek. Itt mindenki megszólítást (_honorific_ angolul) és a vezetéknevét használja (pl. Miss, Mr, Dr stb.).

A szervezők két listában adták át az ülésrendet. Az egyiken a vendégek teljes nevei vannak. A másikon annak az asztalnak a neve, ahol minden vendég ül (minden asztalt fáról vagy virágról neveztek el). Az After Partyhoz hasonlóan a két lista párhuzamos: az első lista 3. helyén álló vendég a második lista 3. helyén lévő asztalnál foglal helyet.

Amikor tehát Mr Pitt beviharzik, ki kell találnod, hogy ő a listádon szereplő „Brad Pitt”, és meg kell mondanod neki, melyik asztalnál ül.

Írj egy `tableFor` (megkeresi, hogy egy vendég melyik asztalnál ül) nevű függvényt. A függvény három bemenetet kap:

- Az első a vendégek teljes neveinek listája, stringek formájában
- A második az asztalnevek listája, ugyanabban a sorrendben, mint a vendégek
- A harmadik pedig az érkező vendég, megszólítással és vezetéknévvel formázva (pl. „Mr Pitt”)

Add vissza annak az asztalnak a nevét, ahol a vendég ül. Ha egyáltalán nincs rajta az ülésrenden, akkor a `"No table found"` stringet add vissza (nincs itt helye mázlistáknak!).

A megszólítás mindig pontosan egy szó, és ami utána következik, az a vendég vezetékneve. A legtöbb vezetéknév egy szóból áll, de néhány előkelőbb név két szóra nyúlik.

De vigyázz, mert rengeteg vezetéknév nagyon hasonlít más vezetéknevekre.

### String/Array metódusok és tulajdonságok

Az előző feladatban megismert `.length` tulajdonság mellett négy olyan metódus is létezik, amelyek hasznosak lehetnek. Sokféleképpen megoldhatod a feladatot, de ezek segítségével juthatsz el a legrövidebb megoldáshoz.

`"...".split(részstring)` egy stringet darabol fel egy másik string mentén. Például:

```js
`"Jeremy".split("e")`
// ["J", "r", "my"]
```

`[...].slice(start)` egy tömb egy részét fogja meg, a `start` indextől kezdve a tömb végéig. A kimetszett elemek egy **új** tömbbe kerülnek, amit visszakapsz. Tulajdonképpen eldobja az első `start` elemet. Például:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].slice(2)
// ["Aron", "DJ", "Glenn", "Isaac", "Bethany"]
```

`[...].join(string)` egy tömb elemeit összefűzi a megadott stringgel. Például:

```js
["Jeremy", "Erik", "Aron", "DJ", "Glenn", "Isaac", "Bethany"].join(" likes ")
// Jeremy likes Erik likes Aron likes DJ likes Glenn likes Isaac likes Bethany
```

`"...".endsWith(string)` megmondja, hogy egy string egy másik stringgel végződik-e. Például:

```js
"Jeremy".endsWith("emy")
// true

"Jeremy".endsWith("Jer")
// false
```
