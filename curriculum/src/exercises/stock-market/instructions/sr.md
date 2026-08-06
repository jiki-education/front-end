---
title: "Berza"
description: "Prati svoju investiciju dok berza nasumično raste i pada."
en_md5: 233edb21475a3846a567f3bdda98ce84
---

Prvog januara ove godine uložio si teško zarađenih 10 dolara na berzi. Odlučio si da to čuvaš kao tajnu od porodice i da im kažeš tek nakon 20 godina kada (nadajmo se!) vrednost znatno poraste.

Postoje tri stvari koje treba razumeti o berzi:

1. Nepredvidiva je. Svake godine može da raste ili da pada. U proseku raste oko 10%, ali može značajno da varira.
2. Kako raste, tvoj novac raste brže od same berze zahvaljujući složenoj kamati. Ako ove godine uložiš 10 dolara, a berza udvostruči svoju vrednost u narednih 10 godina, imaćeš 20 dolara. Ako se vrednost ponovo udvostruči u narednih 10 godina, imaćeš 40 dolara ($20 _ 2, a ne $10 _ 2!)
3. Kada ostvariš profit, moraš o tome da obavestiš poresku upravu!

### Tok vežbe

Imaš funkciju `marketGrowth(year)` (rast tržišta za datu godinu) koja vraća broj za koliko procenata je berza porasla te godine (npr. `5` znači da je porasla za `5%`). Ako uložiš 10 dolara i poraste za 5%, sada imaš 10,50 dolara.

Tvoj zadatak je da pratiš koliko novca imaš svake godine i da to prijaviš poreskoj upravi koristeći `reportTax(year, balance)` (prijava poreza za datu godinu i stanje). Zatim, nakon 20 godina, saopšti svojoj porodici konačni iznos koristeći `announceToFamily(value)` (saopštavanje porodici konačnog iznosa). Prva godina za `marketGrowth(...)` treba da bude ova tekuća godina.

Pogledaj funkcije ispod za više detalja, a ako zapneš, uvek možeš da pogledaš savete!
