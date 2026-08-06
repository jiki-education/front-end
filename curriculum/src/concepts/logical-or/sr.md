---
title: "`or` ključna reč"
description: "Kombinovanje dva uslova pomoću `||` tako da ceo uslov bude tačan kada je bar jedan od delova tačan."
en_md5: 4c9ebc144707760d944e0cddfac5a561
---

Možemo da koristimo i `or`, i opet, nažalost, ne postoji lepa reč za „ili“ u JavaScriptu. Umesto toga, moramo da koristimo ove dve vertikalne crte (engl. _bars_) jednu pored druge da bismo označili ili. Izgleda čudno, ali zaista nije. Navići ćeš se.

Znači, možemo reći: ako je neko stariji od 20 godina ili je u disko opremi, onda može da uđe. Tako da ćemo imati zabavnu žurku sa decom obučenom u disko stilu i loše obučenim odraslima, što zvuči razumno.

```javascript
if (age > 20 || outfit === "disco") {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-or/party-door.webp"
  alt="Jiki dočekuje mešavinu dece u disko stilu i ležerno obučenih odraslih na ulazu u žurku"
  width="327"
  height="400"
/>

Postoji jedna stvar koja ljude zbunjuje i kod `and` i kod `or`, a to je da svaka strana `and`/`or` mora da bude potpuno poređenje. Čak i kada porediš istu promenljivu na obe strane, moraš da je ponoviš. Ne možeš da napišeš `if age is less than 13 or greater than 20`. Moraš da napišeš `if age is less than 13 or age is greater than 20`. Obe strane moraju da budu potpuna poređenja.

```javascript
if (age < 13 || age > 20)
```

Treba da razmisliš o tome kada su oba uslova bitna, a kada samo jedan od njih treba da bude tačan.
