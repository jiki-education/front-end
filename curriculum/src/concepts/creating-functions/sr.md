---
title: "Pisanje sopstvenih funkcija"
description: "Korišćenje ključne reči function za pravljenje sopstvenih mašina koje Jiki može da stavi na svoje police i ponovo koristi."
en_md5: 93286a30a373b5604b60b3c109ad00a3
---

Do sada si koristio funkcije koje su napravljene za tebe, funkcije kao što su `circle`, `rectangle`, `moveRight`, `shoot`. Sve su to funkcije koje su napravljene i stavljene na Jikijeve police.

Ali sada je vreme da počneš da praviš sopstvene funkcije.

Da ti pokažem kako se to radi, hajde da pogledamo kako da napravimo novu funkciju za lavirint pod nazivom `walk5` (hodaj pet koraka).

Ova funkcija će uvek pomeriti lika pet koraka napred. Doduše, nije to najkorisnija funkcija na svetu, ali je dobra i laka da od nje počnemo.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/walk-grid.webp"
  alt="Lik na mreži lavirinta, spreman da napravi pet koraka napred"
  width="500"
  height="314"
/>

Dakle, kad bih te zamolio da napišeš kod koji pomera lika pet koraka napred, mogao bi ili da napišeš `move` (pomeri) pet puta, ili da koristiš petlju za ponavljanje. U ovom primeru, da stvari ostanu jednostavne, koristićemo pristup gde napišemo `move` pet puta za redom.

```javascript
move()
move()
move()
move()
move()
```

Dakle, to je ono što želimo da bude unutar naše funkcije.

Sada, dodaj liniju ispod toga koja govori Jikiju da koristi ovu funkciju. Ovo je već viđeno mnogo puta.

A zatim će naš zadatak biti da sve ovih prvih pet linija umotamo u funkciju, tako da kada Jiki koristi `walk5`, tih prvih pet linija koda se izvršava.

Da pretvorimo ovih pet linija u funkciju, ovih pet pomeranja u funkciju, potrebno nam je da koristimo novu ključnu reč, a to je ključna reč `function`.

Kada koristimo ključnu reč `function`, moramo da uradimo dve stvari. Prvo, da navedemo ime funkcije. U ovom slučaju, to je `walk5`. I drugo, da koristimo vitičaste zagrade da obuhvatimo kod koji kaže: „Ovo treba da uradiš unutar funkcije.“ Dakle, možemo to da dodamo u naš kod, i sada govorimo Jikiju da kreira funkciju pod nazivom `walk5`, a zatim, kada se `walk5` upotrebi, treba da izvrši ovih pet linija koda.

```javascript
function walk5() {
  move()
  move()
  move()
  move()
  move()
}
```

Kada Jiki vidi tu ključnu reč `function`, on će otići i napraviti novu funkciju, staviti te instrukcije na tablu unutar nje, a zatim zalepiti etiketu na mašinu za `walk5`. Potom će tu funkciju staviti na police, pored svih ostalih koje su tamo.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions/jiki-machine-whiteboard.webp"
  alt="Jiki stoji pored nove mašine sa tablom unutar nje za zapisivanje instrukcija funkcije"
  width="500"
  height="396"
/>

E sad, nema ničega posebnog u vezi sa ovom funkcijom koju si napravio u poređenju sa ugrađenim (engl. _built-in_) funkcijama. Sve one samo sede jedna pored druge na njegovim policama.

I kada koristiš funkciju, kada napišeš `walk5()`, Jiki će jednostavno otići, skinuti mašinu sa polica i koristiti je na potpuno isti način kao što je to radio sa bilo kojom drugom funkcijom. Možeš da zamisliš da svaka mašina ima mini Jikija koji živi unutar nje. Mini Jiki uvek nosi ovaj kul šešir. I taj mini Jiki radi na potpuno isti način kao i obični Jiki spolja, prateći instrukcije na isti način.

Jedna ključna stvar koju treba razumeti ovde je da kada Jiki kreira funkciju, on zapravo ne izvršava kod. On samo zapisuje taj kod da bi ga kasnije koristio.

Lik u lavirintu se ne pomera u ovom trenutku kada napišeš ključnu reč `function`.

Jiki je napravio mašinu i stavio je na police. Tek kada mu kažeš da koristi mašinu tako što napišeš `walk5()`, to se zaista i dogodi.
