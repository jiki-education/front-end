---
title: "Rečnici"
description: "Stranica spiralne sveske na kojoj svaki unos ima ključ sa leve i vrednost sa desne strane, pa umesto liste dobijaš označene podatke."
en_md5: b8a26ad63301df1d00ce08e1e429cf05
---

Nizovi su naš prvi izbor kad god imamo listu bilo čega: listu mentora, listu rezultata, listu sastojaka, koju god listu, tu ćeš koristiti niz.

Ali postoji još jedna struktura podataka (engl. _data structure_) koja se takođe vrlo često koristi kada ti treba nešto malo složenije od liste.

Zamisli da želimo da sačuvamo neke informacije o meni: moje ime, moje godine, gde sam rođen. Mogao bi za to da upotrebiš niz, ali onda nije baš jasno šta se tu dešava.

Da li je Engleska mesto gde sam rođen ili mesto gde živim? Da li je 42 broj mojih godina ili nešto drugo?

I ako želim to da koristim, moram da pamtim da je prva pozicija za ime, druga za godine, a treća za mesto rođenja. Sve je to pomalo neuredno, a neuredno je zato što ovo zapravo i nije lista stvari. Složenije je od toga. I tu na scenu stupaju rečnici (engl. _dictionaries_). Rečnik je nova vrsta strukture podataka. To ti je peta po redu. Imaš stringove, brojeve, Boolean vrednosti, nizove, a sada i rečnike.

I želim da rečnik zamišljaš kao list spiralne sveske.

Sa leve strane stoje naslovi, reči `"name"`, `"age"`, `"birthplace"`, i njih zovemo ključevima (engl. _keys_).

A sa desne strane, pored svakog naslova, stoje pravi podaci, `"Jeremy"`, `42`, `"England"`, i njih zovemo vrednostima (engl. _values_).

Baš kao i niz, rečnik je jedna stvar. Jedna stranica iz sveske. I baš kao kod nizova, Jiki može da ga stavi u promenljivu, u kutiju, ili da posluži kao ulaz za funkciju, a može i da izvuče rečnik iz izlaznog otvora. Evo kako rečnik izgleda u kodu. Koristimo vitičaste zagrade da označimo početak i kraj, a unutra imaš parove: ključ sa leve strane, dvotačku, pa vrednost sa desne strane. Između svakog para stoji zarez. Jiki ovo vidi i vadi svoju spiralnu svesku. Piše `name`, `"Jeremy"`, `age`, `42`, i tako redom za svaki par.

A kada završi, otcepi list i stavi ga u kutiju sa oznakom `person` (osoba).

Ima nekoliko pravila koja treba da znaš. Ključevi su uvek stringovi. Moraju da imaju navodnike oko sebe, i svaki ključ mora da bude jedinstven. Ne možeš imati dva ključa koja se zovu `name` u istom rečniku.

Vrednosti mogu da budu iste ako želiš, ali ključevi moraju da se razlikuju.

A vrednosti mogu da budu bilo šta. Mogu da budu stringovi, brojevi, Boolean vrednosti, nizovi, pa čak i drugi rečnici.

Možeš da imaš i prazan rečnik, baš kao što postoji i prazan niz, pa da kreneš od njega i kasnije ga dopunjuješ.

Dakle, imaš rečnik, ali kako da izvučeš nešto iz njega?

Koristimo istu sintaksu sa uglastim zagradama kao kod nizova i stringova, ali umesto broja pozicije upisujemo ključ. Ako želimo da iz rečnika izvučemo nečije ime, pišemo:

```javascript
person["name"] // "Jeremy"
```

To govori Jikiju da pogleda u rečnik `person`, pronađe ključ `"name"` i izvuče njegovu vrednost. Jiki ode do kutije `person`, izvadi stranicu iz sveske, prolazi kroz ključeve dok ne pronađe `"name"`, zatim pročita vrednost, `"Jeremy"`, i stavi je u novu kutiju pod imenom `name`.

Uglaste zagrade uvek znače isto. Posežeš u nešto i vadiš nešto iz toga. Kod nizova i stringova koristiš broj da kažeš sa koje pozicije želiš nešto da uzmeš. Kod rečnika koristiš string za ključ.

Ista ideja, samo malo drugačija sintaksa.
