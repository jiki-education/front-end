---
title: "Metode"
description: "Funkcije koje pripadaju vrednosti i pozivaju se sintaksom sa tačkom, kao što su `\"Jeremy\".includes(\"e\")` ili `\"Jeremy\".toUpperCase()`."
en_md5: 37c097a81459cd2ff4ae684559bd4311
---

Do sada, kada smo razmišljali o stringovima ili brojevima, razmišljali smo o njima kao o prilično statičnim stvarima.

I iako jesu, oni takođe imaju mnogo ugrađenih funkcionalnosti koje Jiki može da koristi.

I kako budemo napredovali, učićemo o ovim funkcionalnostima, o tim nekim sposobnostima koje imaju i koje ti mnogo olakšavaju život.

Postoje dve vrste sposobnosti koje ćemo pogledati, svojstva (engl. _properties_) i metode (engl. _methods_).

Metode su funkcije koje pripadaju stringu.

Umesto da pišemo funkciju u koju stavljamo string kao ulaz, možemo direktno koristiti metodu na tom stringu.

Na primer, sećaš se funkcije koja proverava da li string sadrži određeno slovo unutar sebe? Pa, stringovi zapravo imaju metodu pod nazivom `includes` (sadrži) koja to radi, i možemo je koristiti istom sintaksom sa tačkom koju koristiš za svojstva.

Razlika u odnosu na svojstva je u tome što ih, kada ih pišemo, pišemo kao funkcije sa zagradama i ulazima.

Tako da možemo napisati:

```javascript
"Jeremy".includes("e") // true
```

I dobićemo nazad `true`, jer `"Jeremy"` sadrži `"e"`.

<img
  class="concept-image"
  src="/static/images/concept-assets/methods/jiki-writing-jeremy.webp"
  alt="Jiki piše string Jeremy na listu papira"
  width="359"
  height="400"
/>

Metode se razlikuju od svojstava jer nisu statične činjenice. One su zapravo funkcije. Možeš ih zamisliti kao funkcije koje imaju ugrađenu kutiju u kojoj se nalazi string.

Kako funkcionišu za sada nije toliko bitno. Nećeš ih praviti još neko vreme. Sve što treba da znaš je da metodu koristiš tako što staviš tačku, a zatim uobičajenu sintaksu funkcije.

Jedna stvar koju treba znati kod stringova je da metode ne menjaju ništa unutar stringa. Na primer, postoji metoda `toUpperCase` (u velika slova), koja vraća string sa svim slovima pretvorenim u velika slova. Ali to ne menja originalni string. On i dalje sadrži `"Jeremy"` napisano samo sa velikim J. Umesto toga, Jiki kreira novi string koji je ceo velikim slovima.

```javascript
const name = "Jeremy"
const bigName = name.toUpperCase()

log(bigName) // "JEREMY"
log(name) // "Jeremy"
```
