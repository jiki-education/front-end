---
title: "Petlje u petljama"
description: "Stavljanje jedne petlje unutar druge tako da se unutrašnja petlja potpuno izvrši za svaki korak spoljne petlje, što je savršeno za mreže."
en_md5: 4ca3e15c1737b6e8cf2f03a56d23a887
---

Recimo da želimo red cveća. Možemo da napišemo nešto ovako. Postavimo poziciju, posadimo cvet, povećamo poziciju za 10, ponovimo, i na kraju dobijemo lep, uredan red cveća.

```javascript
let x = 10
repeat(5) {
  plant(x, 50, 10)
  x = x + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/single-row-flowers.webp"
  alt="Jiki za tablom sa jednim urednim redom posađenog cveća ispod"
  width="406"
  height="400"
/>

Ali šta ako želimo mrežu cveća sa redovima i kolonama? Recimo četiri reda sa po pet cvetova u svakom redu.

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/grid-question.webp"
  alt="Mreža cveća četiri puta pet sa Jikijem koji razmišlja kako da je nacrta"
  width="383"
  height="400"
/>

Imamo petlju koja crta jedan red cveća. Kako možeš da iskoristiš tu istu petlju da nacrtaš četiri reda? Ili šta bismo mogli da uradimo da nacrtamo četiri reda?

Jedna mogućnost je da jednostavno kopiraš i nalepiš tu petlju četiri puta i promeniš gornju poziciju za svaki. I to bi radilo. Bilo bi u redu. Ali ponavlja se, a postoji i bolji način. Znamo da kada se kod ponavlja, možemo da koristimo petlju da pojednostavimo stvari.

Ovde možemo da koristimo jednu petlju unutar druge petlje. Jednu petlju za redove i drugu za cveće u tom redu. Hajde da počnemo tako što ćemo da dodamo `repeat` petlju oko postojećeg koda, da osetiš kako to radi. I ponovićemo samo jednom. Dakle, kažemo Jikiju da uradi sve unutar ovih spoljnih vitičastih zagrada jednom. To ima potpuno isti efekat kao da uopšte nemamo ovu spoljnu petlju. Kažemo Jikiju da ponovi nešto jednom, što je isto kao da mu kažemo da to uradi bez `repeat`-a. Ali ovaj kod ovako funkcioniše. To je ispravan, validan kod. Imamo jednu petlju unutar druge petlje.

Dakle, šta se dešava ako promenimo tu spoljnu petlju da ponavlja dva puta? Sada će Jiki da izvrši čitavu stvar sa `plant` (posaditi) pet puta, dva puta. Posadiće 10 cvetova. Ali svi ti cvetovi će biti u istom redu.

Na isti način na koji moramo da pomeramo poziciju sa leva na desno malo svaki put, nakon što nacrtamo ceo red, moramo da pomerimo i vertikalnu poziciju. Pa kako to da uradimo? Možemo da dodamo spoljnu promenljivu za gornju poziciju, koristimo je u našoj `plant` funkciji, a zatim je povećamo za 10 nakon svakog reda.

Razmisli šta je vrednost u svakom trenutku. Gornja pozicija počinje od 10. Prvih pet puta kada sadimo, ostaje takva. Leva pozicija se povećava. A onda joj dodamo još 10, toj gornjoj poziciji, i posadimo još pet cvetova malo niže. Ponovo vraćamo tu levu poziciju na 10, a zatim je ponovo povećavamo svaki put.

I sada možemo da kažemo ponovi ovo četiri puta, i dobićemo četiri reda sa po pet cvetova.

```javascript
let y = 10
repeat(4) {
  let x = 10
  repeat(5) {
    plant(x, y, 10)
    x = x + 10
  }
  y = y + 10
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/nested-loops/flower-grid-result.webp"
  alt="Završena mreža cveća četiri puta pet sa srećnim Jikijem koji pokazuje dva podignuta palca"
  width="389"
  height="400"
/>

Ključna stvar koju treba razumeti je da Jiki završi sav posao u unutrašnjoj petlji (engl. _inner loop_) pre nego što se vrati na spoljnu petlju (engl. _outer loop_). On ne skače napred-nazad. Završi unutrašnju petlju, a zatim prelazi na sledeći korak spoljne petlje.

U ovoj situaciji, možeš da zamisliš spoljnu petlju kao da upravlja grupama ili redovima, a unutrašnju petlju kao da upravlja svakom stavkom u toj grupi ili svakim cvetom u tom redu. Dakle, u našem primeru, spoljna petlja pravi četiri reda, a unutrašnja petlja stavlja pet cvetova, pet stavki u svaku grupu.
