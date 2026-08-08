---
title: "Slučajni brojevi"
description: "Korišćenje `Math.randomInt` sa minimalnom i maksimalnom vrednošću da se dobije različit broj svaki put kad se funkcija pokrene."
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

Često u programiranju želimo da koristimo funkciju i svaki put dobijemo nazad različit slučajan broj (engl. _random number_).

Ovo je korisno na razne načine i na raznim mestima, a naročito u kriptografiji, gde radimo mnogo stvari poput pravljenja kodova koji se dele između mašina i ti kodovi moraju da budu slučajni da ne bi mogli da budu hakovani.

Da bi ti u tome pomogla, na raspolaganju ti je funkcija pod nazivom `Math.randomInt` (slučajan ceo broj). Možda si primetio/la da u sredini ima tačku. Kako budeš dobijao/la pristup većem broju funkcija, možemo ih organizovati u različite grupe da sve bude uredno, a onaj deo `Math` (matematika) je ime grupe kojoj ova funkcija pripada. Ona govori Jikiju na koji odeljak polica treba da pogleda, u ovom slučaju na `Math` odeljak. Tačka jednostavno znači: idi u ovaj odeljak i pronađi funkciju. Za sada se ne brini previše o ovome. Uputstva za vežbe uvek će ti reći koje su funkcije na raspolaganju i kako da ih koristiš. Važno je da razumeš da će Jikiju ova funkcija, kad je on pokrene, dati različit broj svaki put, uz jedno ograničenje. Funkcija ima dva ulaza. Prvi je najmanji broj koji mašina sme da vrati, a drugi je najveći broj koji mašina sme da vrati. Znači, ako koristiš funkciju `Math.randomInt` sa brojevima `10` i `13`, uvek ćeš dobiti nazad `10`, `11`, `12` ili `13`. Ali svaki put će to biti drugi od ta četiri.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki se penje merdevinama do Math odeljka na svojim skladišnim policama"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="Mašina Math.randomInt sa dva ulazna levka na vrhu"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="Mašina Math.randomInt sa brojevima 10 i 13 u ulaznim levcima, koja daje 10, 11, 12 ili 13"
  width="488"
  height="400"
/>

Zamisli, dakle, da želiš da nacrtaš krug na nasumičnom mestu na platnu. Možeš koristiti `Math.randomInt` da dobiješ različite vrednosti za `left` i `top` svaki put, ali sa granicama od, recimo, `10` i `90`, tako da se nikada ne preklapaju i ne izlaze van platna. Svaki put kad pokreneš ovaj kod, krug će biti nacrtan na malo drugačijem mestu.
