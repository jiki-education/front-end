---
title: "Ponavljanje bez broja"
description: "Ostavljanje zagrada `repeat` petlje praznim tako da Jiki nastavi sve dok mu nešto drugo ne kaže da stane."
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

Dosad, kad god koristiš `repeat` petlju, uvek navodiš broj koji kaže koliko puta treba da se ponovi. Ponovi pet puta, 10 puta, 40 puta. Ponekad za ovo koristiš i promenljivu. Ali Jikiju uvek tačno kažeš koliko puta da ponovi petlju. Međutim, ponekad ne znamo unapred koliko puta treba ponoviti. Razmisli o lavirintu. Još na samom početku ovog kursa, rešavaš lavirint tako što napišeš konkretne poteze. Možeš da vidiš lavirint, izbrojiš korake i napišeš tačan broj poteza.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="Lavirint u kojem lik može da vidi putanju, izbroji korake i napiše tačno prave poteze"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

A šta ako bih ti rekao: „Napiši mi kod koji može da reši bilo koji lavirint koji ti dam”„? Taj lavirint može da zahteva 10 koraka, ili 50, ili 200. Nemaš pojma unapred.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Nekoliko različitih lavirinata različitih oblika i veličina, a Jiki se pita kako da reši bilo koji od njih"
  width="402"
  height="400"
/>

Zato ti treba način da Jikiju jednostavno kažeš da nastavi dalje. Da nastavi da proverava kuda može da ide, da donosi odluke, da ide napred, iznova i iznova, sve dok ne završiš.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki trči na traci za trčanje, jednostavno nastavlja iznova i iznova"
  width="428"
  height="400"
/>

A način da to uradiš je zaista jednostavan. Samo nemoj da daješ broj uz ključnu reč „repeat`„. Samo ostavi te zagrade prazne. Ako to uradiš, Jiki će jednostavno nastaviti sve dok mu nešto drugo ne kaže da stane. Kasnije ćemo pogledati šta je to nešto drugo. Ali za sada, on će nastaviti sve dok vežba ne bude gotova, ili dok ne odluči da je već predugo išao, da mu treba pauza i da mu je dosta.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki iscrpljeno klonuo preko trake za trčanje nakon dugog hodanja, spreman da odustane i napravi pauzu"
  width="500"
  height="378"
/>
