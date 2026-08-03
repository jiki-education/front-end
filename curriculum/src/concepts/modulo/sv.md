---
title: "Rest"
description: "Operatorn `%` ger dig det som blir över efter en division och används ofta för att kolla om ett tal är jämnt eller udda."
en_md5: fe49222bd3f3a019dd9f74a960c5dede
---

Hittills har vi använt addition, subtraktion, multiplikation och division när vi räknar. Nu ska vi introducera en till: restoperatorn (_remainder_ på engelska).

Restoperatorn ger dig, logiskt nog, resten när du dividerar två tal, och vi skriver den med ett procenttecken. Så om vi skriver:

```javascript
10 % 4 // 2
```

så säger vi, eller snarare frågar vi: ”Vad blir över när vi delar 10 med 4?” Och svaret är två. Tänk dig att du har tio godisbitar eller nötter och vill dela dem lika mellan fyra personer. Var och en får två, och sedan blir det två över på slutet. Och det som blir över, det är resten. Det är den procenttecknet ger dig.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="En rad med tio godisbitar som delas lika mellan fyra personer, med två över som rest"
  width="500"
  height="22"
/>

En av anledningarna till att vi använder den här ganska ofta i kod är att vi kan ta reda på om något går att dela jämnt eller inte, och det vanligaste mönstret du kommer att se är att kolla om ett tal är jämnt eller udda. Jämna tal går som du vet alltid att dela jämnt med två. Udda tal har alltid ett kvar när du delar med två.

Ta fyra, sex eller åtta: delar du dem med två blir det ingenting över, medan fem, sju och nio alla har ett kvar på slutet när du delar dem med två. Så genom att skriva `if something % 2 === 0` frågar vi: ”Är det här ett jämnt tal?” Och det kan vara användbart till massor av saker. Tänk dig att du skapar ränder i olika färger, eller delar en kö på mitten och skickar varannan person åt ena hållet och varannan åt det andra medan de går mot dig.

En sak att notera: du kanske hör folk kalla den här restoperatorn för modulooperatorn. Modulo och rest är i princip identiska. Det finns några små skillnader som du förmodligen aldrig behöver bry dig om, så vi håller oss till att kalla den restoperatorn för nu, eftersom det är mycket enklare.
