---
title: "Svojstva"
description: "Statične činjenice o vrednosti, kojima se pristupa pomoću tačke bez zagrada, kao što je `.length` za pronalaženje broja slova u stringu."
en_md5: 0634cd72388bef118e9dd22131a3c1cd
---

Do sada, kada smo razmišljali o stringovima ili brojevima, mislili smo o njima kao o prilično statičnim stvarima.

I iako jesu, oni takođe imaju puno ugrađene funkcionalnosti koju Jiki može da koristi.

Postoje dve vrste mogućnosti koje ćemo da pogledamo: svojstva i metode.

Svojstva su činjenice koje možemo da tražimo od Jikija da nam kaže o stvarima. Tako, na primer, stringovi imaju svojstvo koje se zove `length` (dužina), pomoću kojeg Jiki može da nam kaže koliko je string dugačak.

Tako da umesto da prolazimo kroz sva slova da bismo saznali koliko je string veliki, možemo jednostavno da pitamo Jikija da nam kaže.

A da bismo to uradili, koristimo novi oblik sintakse, tačku.

Na primer, ako imamo string `"Jeremy"` i želimo da dobijemo njegovu dužinu, možemo da napišemo:

```javascript
"Jeremy".length // 6
```

Kada Jiki kreira string, on prebrojava slova i, onako, upiše broj u ćošku koliko ih ima.

<img
  class="concept-image"
  src="/static/images/concept-assets/properties/jiki-counting-letters.webp"
  alt="Jiki broji slova stringa Jeremy i upisuje broj u ćošku"
  width="359"
  height="400"
/>

A onda kada koristimo svojstvo `length`, Jiki jednostavno ode i proveri koji je to broj bio. Tako u našem primeru `"Jeremy".length`, kada Jiki kreira string `"Jeremy"`, on prebroji slova, upiše broj šest u ćošku, a zatim kada napišemo `"Jeremy".length`, on ode i proveri ga. Tako da svojstva možeš da zamisliš kao činjenice o toj stvari.
