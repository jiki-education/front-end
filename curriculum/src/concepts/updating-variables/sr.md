---
title: "Ažuriranje promenljivih"
description: "Menjanje onoga što se nalazi u promenljivoj dok se program izvršava, tako da možeš pratiti pozicije, brojčane vrednosti, rezultate i druge vrednosti koje se menjaju."
en_md5: f9b2fbb6bfd82a620b093e88951ff841
---

Do sada, kada smo kreirali promenljive, stavljali smo vrednosti u kutije i kasnije ih vadili. To je bilo veoma korisno jer nam olakšava čitanje koda i smanjuje količinu mentalne aritmetike koju bismo inače morali da radimo. Ali prava moć promenljivih dolazi iz mogućnosti da menjamo ono što se nalazi u kutiji, odnosno u promenljivoj, tokom izvršavanja programa. Zato čak i ako pokrenemo isti deo koda više puta, ono što će se dogoditi može se promeniti u zavisnosti od toga šta se nalazi u kutijama.

Recimo da želimo da posadimo cvet u bašti. Imamo zgodnu `plant` (posaditi) funkciju koja ima jedan ulaz – poziciju na koju želimo da postavimo cvet. Pa ako želimo da postavimo cvet na udaljenosti 10 od ivice, pišemo to ovako:

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="Cvet posađen u bašti pored Jikijeve table"
  width="406"
  height="400"
/>

A šta ako želimo da posadimo osam cvetova? Pa, mogli bismo da pišemo `plant(10)`, `plant(20)`, `plant(30)`, itd., ali to je prilično zamorno.

A već smo naučili nešto što nam pomaže da zamenimo ovakav zamoran kod. Upotrebi petlju! Upotrebi blok `repeat`! Zato hajde da postavimo poziciju na 10, a zatim napravimo `repeat` blok u kojem osam puta pozivamo `plant`, odnosno koristimo funkciju `plant`.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

Šta misliš, šta će se dogoditi?

Pa, posadiće osam cvetova, ali svaki put će ih posaditi na istom mestu, što nije ono što želimo. Zato hajde da na trenutak razmislimo o tome šta Jiki ovde radi. On pravi kutiju sa natpisom „pozicija“. U nju stavlja 10. Zatim osam puta pokreće mašinu `plant`. Svaki put iz kutije pozicije uzima vrednost. Uvek je to 10, i svaki put ubacuje taj isti 10.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki uzima kutiju pozicije sa police i ubacuje vrednost 10 u mašinu za sadnju"
  width="400"
  height="400"
/>

Dakle, ono što nam treba je način da se svaki put pomerimo malo napred. Nakon što posadimo cvet, želimo da kažemo Jikiju da pomeri poziciju za 10, kako bi bio spreman za sadnju sledećeg cveta.

Hajde da na trenutak zaboravimo kod: kako to logički izgleda? Ako ti kažem: „Posadi prvi cvet na 10, onda sledeći na 20, pa sledeći na 30“, kako tvoj mozak zna da sledeći treba posaditi na 40, a onaj posle na 50?

Tvoj mozak prati trenutni broj, dodaje mu 10 i zatim ažurira taj broj u sebi.

I potpuno isto možemo da uradimo u kodu. Da bismo to uradili, kažemo: „Ažuriraj kutiju pozicije da ima trenutnu vrednost pozicije plus 10.“ Ovde se prvi put pojavljuje pojam ažurirati (engl. _update_).

Kada Jiki ovo vidi, izvadiće trenutni broj iz kutije pozicije, dodati mu 10, obaviti tu matematiku, sabrati ih, a zatim vratiti rezultat nazad u kutiju za sledeći put.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki vadi 10 iz kutije pozicije, dodaje 10 da dobije 20 i vraća 20 nazad u kutiju"
  width="427"
  height="400"
/>

Dakle, ako ovo dodamo u naš program, tako da sada kažemo: „Postavi početnu vrednost pozicije na 10“, zatim osam puta posadi cvet na toj poziciji, a zatim promeni poziciju tako da bude za 10 veća nego pre, naš kod funkcioniše i dobijamo osam cvetova raspoređenih u prostoru.

Primeti da nema `let` (stvara novu promenljivu) kada ažuriramo promenljivu. To je veoma važno. Kada Jiki vidi `let`, on stvara novu kutiju. A ovde ne želimo da stvorimo novu kutiju. Želimo da promenimo ono što je već u kutiji koju imamo.

Takođe, obrati pažnju da kutiju kreiramo samo jednom, izvan petlje. To je važno zapamtiti. Kreiraj kutiju jednom na početku, a zatim je ažuriraj svaki put kada se petlja izvrši.

Možemo da ažuriramo ono što se nalazi u kutijama i tu moć možemo da iskoristimo da pratimo nešto što se menja tokom vremena. Ovaj obrazac ćeš stalno koristiti: praćenje pozicije, brojanje koliko se puta nešto dogodilo, vođenje rezultata. Kad god treba da zapamtiš nešto što se menja dok se program izvršava, ovako to radiš.
