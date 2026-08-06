---
title: "Prekid petlje"
description: "Korišćenje ključne reči `break` unutar tela petlje da bi se petlja odmah prekinula i nastavilo izvršavanje koda koji dolazi nakon nje."
en_md5: 30148766de67ae467ab1a4852ad35895
---

Ključna reč `break` može da se koristi bilo gde u telu bilo koje petlje.

Deo između vitičastih zagrada, to je telo. I kada ga Jiki vidi, odmah će izaći iz petlje i preći na sledeći kod ispod petlje.

Zato, ako imamo ograničenje da se ova petlja izvrši 50 puta, ali želimo da se zaustavimo ako je korisnik pucao pet puta, mogli bismo da imamo `for` petlju na početku koja broji do 50.

Ali zatim bismo mogli da imamo uslov u sredini petlje koji proverava da li je korisnik pucao pet puta, i ako jeste, prekinemo (engl. _break_) petlju.

```javascript
for (let i = 0; i < 50; i++) {
  if (numShots >= 5) {
    break; // izađi iz petlje
  }
}
```
