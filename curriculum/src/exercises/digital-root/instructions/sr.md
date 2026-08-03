---
title: "Digitalni koren"
description: "Sažmi broj na jednu cifru tako što uzastopno sabiraš njegove cifre."
en_md5: 9847d9ea8c4a86ad65869e4f7b4c718e
---

Digitalni koren (engl. _digital root_) broja je ono što dobiješ kada sabiraš njegove cifre sve dok ne ostane samo jedna cifra.

Ako ti posle prvog sabiranja cifara i dalje ostane više od jedne cifre, sabereš cifre _tog_ rezultata, i tako nastavljaš dok ne ostane jedna cifra.

Na primer, da bismo našli digitalni koren broja `942`:

```
9 + 4 + 2 = 15
1 + 5 = 6
```

Dakle, digitalni koren broja `942` je `6`.

Broj koji već ima samo jednu cifru (kao `7`) sam je svoj digitalni koren.

Napravi funkciju pod nazivom `digitalRoot` koja prima broj i vraća njegov digitalni koren.

### Funkcija `String()`

U poslednjih nekoliko lekcija na raspolaganju ti je funkcija `Number(str)`, koja pretvara string u broj.

Isto možeš da uradiš i u suprotnom smeru, pa broj pretvoriš u string pomoću funkcije `String(num)`. Na primer:

```js
String(147) === "147"
```

Primeti da i ova funkcija počinje velikim slovom, i ponovo, za sada ne brini zašto je to tako!

### Primena naučenog u praksi

Iako postoji mnogo načina da se ova vežba reši, rešenje do kog želimo da dođeš koristi `while` petlju.

Uživaj!
