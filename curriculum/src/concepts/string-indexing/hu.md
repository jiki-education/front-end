---
title: "A string indexelése"
description: "Szögletes zárójellel és egy pozíciószámmal egyetlen betűt veszünk ki egy stringből. Ne feledd, a pozíciók nullától indulnak."
en_md5: dc6b55a9d0582321bfe69409e64858d6
---

Képzeld el, hogy itt van a nevem, Jeremy, és ki szeretnéd venni belőle a monogramomat, a J betűt. Hogyan fogjunk hozzá?

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-thinking.webp"
  alt="Jiki azon gondolkodik, hogyan lehet egyetlen betűt kivenni egy stringből"
  width="361"
  height="353"
/>

Gondolj úgy a stringre (karakterláncra), mint betűk sorozatára. A Jeremy név hat betűből áll, J-E-R-E-M-Y, és mindegyik betűnek megvan a maga pozíciója. A J az első helyen áll, az Y az utolsón.

A JavaScriptben és a legtöbb programozási nyelvben ezek a pozíciók nullától indulnak. Vagyis az első betű, a J, a nulladik pozíción van, utána jön az E az egyes pozíción, az R a kettesen, az E a hármason, az M a négyesen, az Y pedig az ötösön.

Ez a nullától számolás elsőre elég furcsa, és őszintén szólva egyszerűbb lenne az élet, ha simán egytől számolnánk, ahogy a hétköznapokban szoktunk.

De nem így teszünk. A legtöbb programozási nyelvben nullától kezdünk számolni, ezt egyszerűen meg kell tanulnod.

Ha tehát egy adott pozíción lévő betűt szeretnénk kivenni, használjunk szögletes zárójelet (`[]`), benne a pozíció számával.

Ha azt írjuk, hogy `"Jeremy"[0]`, azzal azt mondjuk: add ide a Jeremy szó első betűjét.

Ha azt írjuk, hogy `"Jeremy"[1]`, akkor a második betűt kérjük.

```javascript
"Jeremy"[0]
"Jeremy"[1]
```

Ugyanez változókkal (variable) is működik. Ha létrehozunk egy name nevű változót, és értékül a Jeremy stringet adjuk neki, akkor a `name[0]` szintén a J betűt adja vissza.

```javascript
let name = "Jeremy"
name[0]
```

Egy dolgot azért tisztázzunk: amit a `name[0]` visszaad, az is csak egy string. Egy újabb papírlap, rajta egy J betűvel. Semmi különleges nincs benne. Ugyanolyan string, mint amilyen a Jeremy is.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-indexing/jiki-holding-j.webp"
  alt="Jiki egy új papírlapot tart a kezében, amin csak a J betű áll"
  width="500"
  height="289"
/>

Csak épp egyetlen betű van rajta hat helyett.

És mindez az eredeti stringet egyáltalán nem érinti. Nem tépjük ki belőle a J-t, vagy ilyesmi. Egyszerűen megkeressük, melyik betű kell nekünk, és készítünk egy új stringet, benne ezzel a betűvel.
