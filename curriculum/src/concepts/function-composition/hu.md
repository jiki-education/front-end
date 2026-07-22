---
title: "Több függvény együttes használata"
description: "Egy probléma felbontása kis, egy-egy feladatért felelős függvényekre, amelyek egymást hívják, így minden rész egyszerű és újrafelhasználható marad."
en_md5: ad2543cd14eda88331fdd3b0f82f05db
---

Eddig, amikor függvényeket (function) írtál, mindegyik nagyjából megállt a saját lábán, és minden logikát tartalmazott, amire a működéséhez szüksége volt.

Most azt nézzük meg, hogyan bonthatod fel őket: a nagy, sok mindent csináló függvények helyett kisebbeket írunk, amelyek együttműködnek.

A programozásban általános szabály, hogy minden függvény a lehető legkevesebbet csinálja. Erre mondjuk azt, hogy a függvénynek egyetlen felelőssége (single responsibility) van. Minden függvény csak egy dolgot csináljon, a részfeladatokhoz pedig használjon más függvényeket.

Nézzünk egy példát.

Képzeljük el, hogy van egy függvényünk, amelynek az a dolga, hogy visszaadjon egy stringet (karakterláncot), amely leír egy nevet.

Egy egyszerű változat így nézne ki. Van benne egy számláló ciklus (loop), amilyet már te is írtál, és egy string-sablon, amely összerakja az eredményt.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

Ez jól működik, de két dolgot csinál egyszerre. Az egyik egészen általános: a számolás. A másik nagyon is konkrét: ennek a stringnek az összeállítása egy adott formátumban.

Sokkal szebb lenne két függvényre bontani: az egyik a számolásért felelne, a másik pedig azért, hogy ebben a formátumban leírjon egy nevet.

```javascript
// Csak megszámolja a betűket
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Csak szépen formázza a szöveget
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

Az általános számoló függvényt aztán újra felhasználhatjuk ebben a string-formázásban, de bárhol máshol is, ahol csak szükségünk van rá. Amikor egy string betűit kell megszámolni, az teljesen független mindentől, aminek a kiíráshoz köze van.

Mindkét függvényt önmagában is elolvashatod, és azonnal érted, mit csinál.

Ahogy a függvényeid egyre összetettebbek lesznek, és egyre több lesz belőlük, ezen a technikán múlik, hogy rendezett, olvasható kódod lesz-e, vagy teljes káosz és zűrzavar.

Egy dolgot érdemes itt újra megemlíteni: amit egy függvényen belül hozol létre, azt más függvények nem érik el, hacsak szándékosan vissza nem adod.

Ha tehát a `describeName` belsejéből próbálsz hivatkozni a count változóra (variable), nem tudod megtenni, mert az a másik függvényhez tartozik.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki egy villanykörtével a feje fölött azon gondolkodik, hogyan maradnak a változók privátak az egyes függvényeken belül"
  width="361"
  height="353"
/>

A JavaScriptben létrehozhatunk legfelül, minden fölött olyan változókat, amelyeken a függvények osztoznak, de nagyon ajánlom, hogy ezt ne tedd, hacsak nincs rá igazán jó okod.

Minél függetlenebbek maradnak a függvényeid (a szakszó erre a tiszta függvény, angolul pure function), annál tisztább lesz a kódod, és annál kevesebb bug kerül bele.
