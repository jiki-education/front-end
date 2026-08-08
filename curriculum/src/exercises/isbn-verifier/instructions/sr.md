---
title: "Provera ISBN-a"
description: "Proveri da li je ISBN broj knjige validan."
en_md5: 1f50053213b8649f126851f264174e53
---

Svaka knjiga ima ISBN, desetocifreni broj koji je jedinstveno identifikuje. Svaki ISBN je jedinstven i prati određeni format. Takođe postoji formalni proces verifikacije koji proverava da li je neki string ISBN, a ti ćeš ga napraviti u ovoj vežbi.

ISBN-ovi obično sadrže crtice i izgledaju ovako: `3-598-21508-8`

(Postoje i ISBN-ovi sa 13 cifara, ali za ovu vežbu ih slobodno ignoriši!)

### Provera ISBN-a

Da bismo proverili ISBN, mi:

- Počnemo sa leve strane i saberemo svaku cifru pomnoženu težinom koja se smanjuje od 10 do 1.
- Dobijemo ostatak tog zbira podeljen sa 11.
- Proverimo da li je taj ostatak nula.

Na primer, za ISBN `3-598-21508-8`, proverili bismo da li važi:

```
(3*10 + 5*9 + 9*8 + 8*7 + 2*6 + 1*5 + 5*4 + 0*3 + 8*2 + 8*1) % 11 === 0
```

Pošto je rezultat 0, to dokazuje da je naš ISBN validan.

Još par važnih napomena:

- Ponekad se ISBN može završavati znakom X. U tom slučaju, X predstavlja `10`. Ako se X pojavi bilo gde drugde, ISBN nije validan.
- ISBN-ovi mogu biti napisani sa ili bez crtica.
- Bilo koji drugi karakteri čine ISBN nevalidnim.

### Tvoj zadatak

Napravi funkciju pod nazivom `isValidIsbn(isbn)` (proverava da li je ISBN validan) koja prima ISBN string i vraća `true` ako je validan, a `false` ako nije.

### Funkcija `Number(...)`

Jedna stvar koju još nismo obradili, a koju treba da znaš, jeste funkcija `Number(str)`. To je funkcija koja prima string i vraća taj string kao broj. Tako da, ako napišeš `Number("1234")`, dobijaš `1234`. To je neobična funkcija jer počinje velikim slovom. Ne brini o tome za sada – objasnićemo zašto je to tako mnogo kasnije.

Saznaj više na <a href="/concepts/type-conversion" target="_blank" rel="noopener noreferrer">stranici koncepta o konverziji tipova</a>.

### Korišćenje onoga što si upravo naučio

Kao i u prethodnoj vežbi, iako postoji mnogo validnih načina da se ova vežba reši, rešenje koje želimo da smisliš koristi `continue` naredbu.

Bonus scenario te izaziva da ovo rešiš u 22 linije koda. Postoje i kraća rešenja, ali ako si došao do 22 linije, dobro si optimizovao.

Zabavi se!
