---
title: "Függvények, amelyek visszaadnak valamit"
description: "Elkapjuk az értéket, amely a függvény kimeneti csúszdáján érkezik, és felhasználjuk a kódunkban."
en_md5: 9ce745b968f6f0c1a59484b923ede9d8
---

Eddig olyan függvényeket néztünk, amelyek csinálnak valamit a világban. A circle függvény kört rajzol. A move függvény odébb mozgatja a karakteredet. Néhány függvény viszont másképp működik. Ahelyett, hogy kifelé csinálna valamit, visszaad neked valamit, amit a kódodon belül használhatsz fel. Amikor egy függvény visszaad valamit Jikinek, hogy azt a kódban használja, azt mondjuk, hogy a függvény visszaad (_returning_ angolul) valamit. Visszaad valamit Jikinek. Ezeket a gépeket úgy képzelheted el, mint amelyeknek kimeneti csúszdájuk van. Megvannak már a bemeneti nyílásaink, amelyekbe bedobjuk a dolgokat, de lehet a gépen egyetlen kimeneti nyílás, vagyis egy csúszda is, amelyen valami visszajöhet. Amikor Jiki megnyomja a gép gombját, a gép zakatolni kezd, és a végén valami kipottyan a csúszdán. Lehet, hogy egy szám. Lehet, hogy egy string. Olyasmi, amit Jiki elkaphat és felhasználhat.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="Egy gép, amelynek az oldalán kimeneti csúszda van, készen arra, hogy visszajuttasson egy értéket Jikinek"
  width="500"
  height="317"
/>

A legtöbb függvény, talán 95 százalékuk, visszaad valamit. Elvégeznek neked valamilyen számolást, és visszaadják az értéket, vagy összeragasztanak néhány stringet, és odaadják az így kapott stringet. Vagy éppen a pontos időt adják vissza, valahányszor lefuttatod azt a gépet. Nézzük meg ezt az utolsót! Tegyük fel, hogy van egy `getCurrentTime` (az aktuális idő lekérése) nevű függvényünk. Valahányszor Jiki elindítja a gépet, a kimeneti csúszdán kicsúszik egy papírlap, rajta az idővel, mondjuk azzal, hogy 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="A getCurrentTime gép, amelynek kimeneti csúszdáján egy 14:35 feliratú papírlap csúszik ki"
  width="500"
  height="312"
/>

A visszaadott értéket aztán a `let` segítségével egy dobozba tehetjük. Ha azt írjuk, hogy `let time = getCurrentTime()`, Jiki lefuttatja a gépet, elkapja a csúszdából az aktuális időt, és egy `time` nevű dobozban tárolja el.

```javascript
let time = getCurrentTime()
```

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki a csúszdából érkező 14:35-ös papírlapot egy time feliratú dobozba teszi"
  width="372"
  height="400"
/>

Fontos megérteni, hogy a papírlap, amelyet Jiki a dobozba tesz, abban a pillanatban rögzül. Hiába változik közben a tényleges idő, amíg a programod fut, a dobozban továbbra is az a papírlap van, amelyre 14:35 van írva. Ami egyszer bekerült a dobozba, az ott egy rögzített dolog. Nem változik meg varázsütésre. Ha a jövőben újra az aktuális időt akarjuk a dobozba tenni, megint a `getCurrentTime` függvényünket kell használnunk hozzá.

A legtöbb függvénynek, amely visszaad valamit, bemenetei is vannak. Lehet például egy `join` (összefűz) függvényünk, amely két stringet kap bemenetként, és szóközzel összefűzve adja vissza őket. Ha tehát a `join` gépet a `"Hello"` és a `"World"` bemenetekkel használjuk, a csúszdán egyetlen string érkezik ki, rajta a `"Hello World"` felirattal.

```javascript
join("Hello", "World"); // "Hello World"
```
