---
title: "Izmena rečnika"
description: "Korišćenje `dict[key] = value` za ažuriranje postojećih unosa ili dodavanje novih, plus metoda `has` za proveru ključeva."
en_md5: 254912c3c672aec40b2729cd005fb1a7
---

Znaš kako se pravi rečnik i kako se iz njega izvlače vrednosti. Ali šta se dešava kada se podaci promene? U jednom trenutku, ja ću ostariti. Neću više imati `42` godine, imaću `43`.

Kako mi ažuriramo rečnik? Pa, koristimo vrlo sličan način kao kad nešto pronalazimo. Znaš da nešto pronalazimo pomoću uglastih zagrada da izvučemo vrednost. E pa, možemo i da koristimo uglaste zagrade sa znakom jednakosti da ažuriramo rečnik. Jiki ide do kutije `person`, vadi stranicu beležnice, pronalazi ključ `"age"`, a zatim briše `42` koji je tamo bio i na njegovo mesto upisuje `43`, i onda se stranica iz beležnice vraća u kutiju. To je izmena samog rečnika.

```javascript
person["age"] = 43
```

Jiki ne pravi novi rečnik, on menja beležnicu koja je već bila u kutiji.

A šta ako želiš da dodaš informaciju koje ranije nije bilo? Pa, možeš da uradiš potpuno istu stvar.

Ako navedeš ključ koji ne postoji, Jiki će jednostavno dodati novi ključ na dno, zajedno s tom vrednošću.

Dakle, u ovom slučaju, otvoriće beležnicu, potražiti `"country"`, videće da ga nema, i onda će dodati novi red na dnu, `"country"` levo, `"England"` desno.

```javascript
person["country"] = "England"
```

Dakle, potpuno ista sintaksa kao za izmenu vrednosti. Jiki automatski rešava obe situacije. Ako ključ postoji, ažurira ga. Ako ne postoji, dodaje ga. Ne moraš ništa posebno da radiš.

I baš kao što možeš krenuti od praznog niza i ubacivati stvari u njega, tako možeš krenuti od praznog rečnika i dodavati ključeve jedan po jedan. To je, opet, vrlo čest obrazac. Viđaćeš ga stalno.

Jedna česta upotreba rečnika jeste vođenje brojanja stvari. Ključeve možeš postaviti kao stvari čije brojanje želimo da pratimo, a vrednosti kao njihove brojeve. Zamisli da posmatraš ptice i želiš da pratiš koliko si koje ptice video. Svaki put kada vidiš pticu, postaviš njen broj na jedan, a zatim svaki sledeći put kada je vidiš, uzmeš njenu trenutnu vrednost i povećaš je za jedan. Da bi ovaj obrazac funkcionisao, potreban nam je način da proverimo da li rečnik već sadrži taj ključ – u tom slučaju mu dodajemo jedan – ili ako nema taj ključ, moramo da počnemo od jedan.

A za to imamo metodu na rečnicima, `has` (proverava da li postoji ključ).

Navedeš ključ koji te zanima, a Jiki će proveriti da li rečnik ima taj ključ ili ne, i zatim vratiti tačno ili netačno u skladu s tim.

```javascript
person.has("age") // true
```

Kad sve to spojimo, obrazac za brojanje izgleda ovako:

```javascript
if (counts.has(letter)) {
  counts[letter] = counts[letter] + 1
} else {
  counts[letter] = 1
}
```
