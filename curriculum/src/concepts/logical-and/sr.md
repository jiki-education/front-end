---
title: "Ključna reč `and`"
description: "Kombinovanje dva uslova pomoću `&&` tako da je ceo uslov tačan samo kada su oba dela tačna."
en_md5: 6ea0de65a81d8e5c8d2eb89f3db29705
---

Da te pitam da otvoriš vrata samo ako je neko stariji od 20 godina, verovatno bi znao šta da radiš. Ali šta ako treba da proveriš da li je neko stariji od 20 i da li je obučen u odgovarajuću odeću? Dakle, treba da proveriš dva različita uslova istovremeno. Kako bi to uradio?

Možda bi mogao da imaš ugnežđenu (engl. _nested_) if naredbu, pomalo kao što smo imali ugnežđene petlje ranije. Tako da bi mogao da kažeš, ako je `age` veći od `20`, onda ulazimo u ovaj blok koda, a zatim još jedan if `outfit` je jednak `"disco"`, i još jednu vitičastu zagradu i novi blok koda. To bi funkcionisalo, ali postaje prilično neuredno, posebno kada želiš da imaš mnogo uslovnih grananja.

Srećom, postoji lakši način, a to je da možemo imati uslove koji imaju više delova. Umesto da proveravamo samo jednu stvar u uslovu, možemo da proverimo dve, tri ili više stvari. A da bismo to uradili, moramo da koristimo ključnu reč `and`. Sad, nažalost, u JavaScriptu, ključna reč and zapravo nije reč and, kao što je u nekim jezicima. Umesto toga, moraš da staviš dva ampersande jedan pored drugog. Moratćeš jednostavno da zapamtiš ovo. Mrski je, ali je tako, i navići ćeš se.

Tako da možemo da koristimo ovo da napravimo složeniji uslov. Možemo da kažemo ako je `age` veći od `20` i `outfit` je `"disco"`, onda nastavljamo. Ako je `age` manji od `20` ili `outfit` nije `"disco"`, onda je cela naredba, ceo uslov netačan. Ako si ikada učio logiku, možda si pravio elektroniku ili si radio napredniju matematiku, onda će ti ovo delovati sasvim prirodno. Ako nisi, brzo ćeš savladati.

```javascript
if (age > 20 && outfit === "disco") {
  openDoor()
}
```

Ima jedna stvar koja zbunjuje ljude i sa and i sa or, a to je da svaka strana i/ili (engl. _and/or_) mora da bude potpuno poređenje. Dakle, čak i ako porediš istu promenljivu na obe strane, moraš je ponoviti. Ne možeš napisati `if age is greater than 13 and less than 20`. Moraš napisati `if age is greater than 13 and age is less than 20`. Obe strane moraju biti potpuna poređenja.

```javascript
if (age > 13 && age < 20)
```
