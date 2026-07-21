---
title: "Az `or` kulcsszó"
description: "Két feltétel összekapcsolása a `||` operátorral, hogy a teljes feltétel akkor legyen igaz, ha legalább az egyik része igaz."
en_md5: f8b393c31a9d08487d04fc0626919178
---

A vagy kapcsolatot is használhatjuk, és sajnos a JavaScriptben ehhez sincs egy kedves or kulcsszó (keyword). Helyette ezt a két függőleges vonalat írjuk egymás mellé, ez jelenti azt, hogy vagy. Elsőre furán néz ki, de igazából nem az. Meg fogod szokni.

Mondhatjuk tehát azt, hogy ha valaki elmúlt 20 éves, vagy diszkószerelésben van, akkor bejöhet. Lesz tehát egy jó kis bulink diszkóruhás gyerekekkel és rosszul öltözött felnőttekkel, ami egészen észszerűen hangzik.

```javascript
if (age > 20 || outfit === "disco") {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-or/party-door.webp"
  alt="Jiki diszkóruhás gyerekek és hétköznapi öltözetű felnőttek vegyes társaságát engedi be a buli ajtaján"
  width="327"
  height="400"
/>

Van egy dolog, ami az „és”-nél és a „vagy”-nál is sokakat megzavar: az és/vagy mindkét oldalán egy-egy teljes összehasonlításnak kell állnia. Ezért még ha ugyanazt a változót (variable) hasonlítod is össze mindkét oldalon, akkor is újra le kell írnod. Nem írhatod azt, hogy `if age is less than 13 or greater than 20`. Azt kell írnod, hogy `if age is less than 13 or age is greater than 20`. Mindkét oldalon teljes összehasonlításra van szükség.

Azt kell átgondolnod, hogy mikor számít mindkét feltétel, és mikor elég, ha csak az egyik igaz.
