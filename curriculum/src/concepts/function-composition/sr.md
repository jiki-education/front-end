---
title: "Korišćenje više funkcija zajedno"
description: "Razdvajanje problema na male funkcije sa jednom odgovornošću koje se međusobno pozivaju, tako da svaki deo ostane jednostavan i ponovo iskoristiv."
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

Do sada, kada pišeš funkcije, svaka je uglavnom stajala na svojim nogama i sadržavala svu logiku koja joj je potrebna za rad.

Sada ćemo pogledati kako da razbijemo funkcije tako da imamo manje funkcije koje rade zajedno, umesto velikih funkcija sa mnogo toga što se dešava unutra.

Kao opšte pravilo u programiranju, želiš da svaka funkcija uradi što manje može. To nazivamo da funkcija ima jednu odgovornost (engl. _single responsibility_). Svaka funkcija treba da radi samo jednu stvar i da koristi druge funkcije za različite poddelove toga.

Pa hajde da pogledamo primer.

Zamisli da imamo funkciju čiji je posao da vrati string koji opisuje ime.

Jednostavna verzija bi izgledala ovako. Imamo petlju za brojanje, nešto što si već napisao, a zatim string šablon koji sklapa rezultat.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

Ovo radi dobro, ali radi dve stvari. Radi jednu prilično opštu stvar, brojanje, i drugu veoma specifičnu stvar, sastavljanje ovog stringa u određenom formatu.

Bilo bi mnogo lepše razbiti ovo na dve funkcije, jednu koja je odgovorna za brojanje i drugu koja je odgovorna za opisivanje imena u ovom konkretnom formatu.

```javascript
// Just counts letters
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Just formats text nicely
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

I onda možemo ponovo iskoristiti tu opštu funkciju za brojanje u ovom formatiranju stringa, ali i na bilo kom drugom mestu gde nam zatreba. Kad god treba da prebrojimo slova u stringu, to je potpuno odvojeno od svega što ima veze sa ispisom.

Obe funkcije možeš čitati izolovano i odmah razumeti šta svaka od njih radi.

Kako tvoje funkcije postaju složenije i kako ih imaš više, ova tehnika je razlika između čistog, čitljivog koda i potpune zbrke i haosa.

Ima jedna stvar koju vredi ponovo pomenuti ovde, a to je da bilo šta što napraviš unutar funkcije ne može da bude dostupno drugim funkcijama, osim ako to namerno ne vratiš.

Pa ako pokušaš da referenciraš promenljivu `count` (brojač) iz unutrašnjosti `describeName` (opisuje ime), ne možeš to učiniti, jer pripada drugoj funkciji.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki razmišlja, sa sijalicom iznad glave, o tome kako promenljive ostaju privatne za svaku funkciju"
  width="361"
  height="353"
/>

U JavaScript-u možemo da napravimo promenljive na vrhu, iznad svega, koje su deljene između funkcija, ali stvarno preporučujem da to ne radiš osim ako nemaš stvarno dobar razlog.

Što više držiš svaku funkciju nezavisnom, a tehnički termin za to je _pure_ (čista), čiste funkcije, to će tvoj kod biti čistiji i manje ćeš grešaka praviti i imati.
