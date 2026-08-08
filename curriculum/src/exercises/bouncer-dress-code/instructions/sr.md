---
title: "Izbacivač: pravila oblačenja"
description: "Iskombinuj odeću osobe, njene godine i to da li je na spisku gostiju da odlučiš ko ulazi."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Opet radiš svoj honorarni posao izbacivača, a večeras si na vratima kluba sa strogim pravilima oblačenja.

Tvoj posao je da proveriš šta osoba nosi, kao i koliko ima godina, i da odlučiš šta ćeš. Ovog puta pratiš neka „zanimljivija“ pravila.

### Pravila

- **Svako** u **svečanoj** ili **elegantnoj** odeći se pušta unutra (bez obzira na to da li je na spisku gostiju) i nude mu se kanapei.
- **Odraslima** (18 ili više godina) u **svečanoj** odeći se **uz to** nudi i šampanjac.
- **Deca** (mlađa od 18) u bilo kojoj drugoj odeći smeju da uđu **samo ako** su na spisku gostiju.
- Svi ostali se odbijaju.

Kategorije oblačenja:

- **Svečano** znači `"ballgown"` ili `"tuxedo"`
- **Elegantno** znači `"suit"` ili `"dress"`

### Tvoje mogućnosti

Imaš tri funkcije za dobijanje podataka:

- `getOutfit()` (uzmi odeću) vraća naziv odeće koju osoba nosi (npr. `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (uzmi godine) vraća godine osobe.
- `onGuestList()` (na spisku gostiju) vraća da li je osoba na spisku gostiju.

Svaku od funkcija za dobijanje podataka smeš da upotrebiš samo jednom u rešenju (inače će se ljudi iznervirati ako ih stalno zapitkuješ kako se zovu i slično!)

Zatim imaš i akcije koje možeš da izvedeš:

- `offerChampagne()` (ponudi šampanjac) nudi osobi čašu šampanjca
- `offerCanapes()` (ponudi kanapee) nudi osobi kanapee (tartar od lososa)
- `letIn()` (pusti unutra) pušta osobu u klub
- `turnAway()` (odbij) odbija osobu sa vrata

### Efikasno pisanje koda

Ovo može da se reši na mnogo načina. Tvoj cilj je da sva ta pravila sastaviš tako da kod bude **jasan za čitanje**. Izbegavaj ponavljanje gde god možeš.

Zabavi se i srećno!
