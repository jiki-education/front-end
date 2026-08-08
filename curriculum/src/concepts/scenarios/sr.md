---
title: "Scenariji"
description: "Različiti početni uslovi protiv kojih vežba pokreće tvoj jedan komad koda, tako da moraš da ga nateraš da radi za sve njih."
en_md5: d5c4ee54eed8083e13f18bb7d256b86d
---

Svaka vežba dolazi sa različitim scenarijima, različitim situacijama koje tvoj kod treba da obradi.

Videćeš ih kao male dugmiće odmah iznad izlaza svake vežbe. Svako dugme se odnosi na različit scenario. Tvoj zadatak je da napišeš kod koji radi za sve njih, a ne samo za prvi. Hajde da ponovim. Pišeš kod samo jednom, ali taj isti kod se izvršava za svaki scenario. Razlika je u tome što svaki scenario može biti malo drugačije postavljen, ili funkcije koje su ti date mogu vratiti malo drugačije vrednosti u zavisnosti od toga u kom si scenariju.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/scenario-buttons.webp"
  alt="Red dugmadi za scenarije odmah iznad izlaza vežbe, zaokružen da bi se istakli"
  width="500"
  height="318"
/>

Uzmi primer igre golfa. Moglo bi ti biti potrebno da menjaš koliko daleko se loptica kotrlja na osnovu povratne vrednosti (engl. _return value_) funkcije pod nazivom `getShotLength` (dužina udarca), koja ti govori koliko je daleko golfer udario lopticu. Zamisli da je igrač morao da prevuče po telefonu kako bi označio koliko je daleko udario.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/golf-game.webp"
  alt="Scena igre golfa sa golferom, lopticom i zastavicom u rupi desno"
  width="412"
  height="400"
/>

Rezultat koji dobijaš nazad dolazi kroz ovu funkciju. Tako u jednom scenariju možeš koristiti funkciju `getShotLength` i ona će vratiti `23`, mali potez. U drugom vraća `70`, dug potez. U još jednom vraća `45`. Tvoj kod treba da otkotrlja lopticu na pravu razdaljinu za svaki scenario samo jednim programom, jednim skupom koda. Moraćeš da koristiš funkciju `getShotLength` da vidiš koliko je daleko udarac otišao, a zatim da otkotrljaš lopticu do tog mesta.

```javascript
let distance = getShotLength()
```

Scenariji obezbeđuju da tvoj kod zaista ispravno radi. Prilično je lako napisati kod koji radi u jednoj specifičnoj situaciji. Mnogo je teže i vrednije napisati kod koji radi u mnogo različitih situacija. Kada rešavaš vežbe, počni sa prvim scenariom. Reši ga. Zatim pređi na sledeći scenario i reši i njega. Kada tvoj kod pukne na nekom drugom scenariju, razmisli šta je drugačije i kako tvoj kod treba da se prilagodi.
