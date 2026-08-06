---
title: "Ulazi funkcija"
description: "Stavljanje vrednosti u ulazne otvore funkcije kako bi se promenilo ono što radi svaki put kada se pokrene."
en_md5: 0bd82377f2407de5fe030511752d5503
---

Jedna od moćnijih stvari kod mašina, kod funkcija, jeste što mnoge od njih dozvoljavaju da u njih ubaciš neku informaciju, koja, kada ih pokreneš, menja ono što rade.

Do sada smo videli mašine koje pomalo liče na kutije, poput one za `move` (pomeri).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="Mašina move, obična kutija bez ulaznih otvora"
  width="322"
  height="400"
/>

Ali neke mašine imaju otvore, kao ova mašina `walk` (šetaj). Mašina `walk` je sasvim slična mašini `move`. Ona pomera lik (engl. _character_) napred, s tim što Jiki može da iskoristi otvor da odredi koliko koraka tvoj lik treba da napravi napred. Dakle, umesto da moraš da koristiš funkciju `move` tri puta zaredom, `move`, `move`, `move`, sada možeš samo da upotrebiš funkciju `walk` i kažeš Jikiju da stavi broj tri u mašinu.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="Mašina walk, sa ulaznim otvorom na vrhu za broj koraka"
  width="481"
  height="400"
/>

Da bismo to uradili u kodu, i dalje pišemo ime funkcije, u ovom slučaju `walk`, i i dalje stavljamo otvorenu zagradu. Ali onda, pre nego što stavimo zatvorenu zagradu, kažemo šta želimo da ulaz (engl. _input_) bude. U ovom slučaju, želimo da ulaz bude tri, da kažemo `walk` tri koraka napred:

```javascript
walk(3)
```

Kada Jiki to vidi, uzeće broj tri, a ti taj broj možeš zamisliti kao mali novčić, i on će ga staviti u ulazni otvor mašine pre nego što povuče ručicu da je upali.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki ubacuje broj 3 poput novčića u otvor mašine walk, a zatim okreće ručicu"
  width="421"
  height="400"
/>

Za funkcije koje crtaju pravougaonike i krugove, moraš da kažeš Jikiju da ubaci nekoliko različitih brojeva, određujući stvari poput toga koliko udaljeno od leve ivice treba da bude, koliko udaljeno od vrha, širinu pravougaonika, visinu pravougaonika.

U Jikijevom svetu, to su samo različiti otvori, po jedan za svaki od tih brojeva.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="Mašina za pravougaonik sa otvorima za levu, gornju, širinu, visinu, i mašina za krug sa otvorima za cx, cy, poluprečnik"
  width="396"
  height="400"
/>

Dakle, u kodu samo napišemo svaki broj i između njih stavimo zarez. Ime funkcije, zagradu, broj za svaki od ulaza, sve razdvojeno zarezima, a zatim zatvorimo zagradu:

```javascript
rectangle(10, 20, 30, 40)
```

Ako pokušaš da upotrebiš funkciju sa pogrešnim brojem ulaza, dobićeš grešku. Na primer, ako pokušaš da staviš jedan ulaz u mašinu koja nema otvor, Jiki će ti reći da ne možeš. A ako pokušaš da koristiš mašinu koja ima ulazni otvor, ali ne kažeš Jikiju šta da stavi u njega, i on će stati i žaliti se. Probaj ako si malo buntovno raspoložen i vidi šta se dešava. Pravljaćeš mnogo ovakvih grešaka kako stvari postaju složenije. Pokušaj da se ne stresiraš ili uznemiravaš zbog toga. Svi učimo iz grešaka. To je bukvalno najbrži način da naš mozak stvarno usvoji stvari. I svi prave ove greške. Svi smo počeli od nule, tako da nemoj da se stresiraš.

Još jedna stvar vredna pomena: ponekad ćeš u vežbama videti linije koje počinju sa dve kose crte, `//`. One se zovu komentari (engl. _comments_). To su privatne beleške samo za tebe koje će Jiki potpuno ignorisati. Dakle, ako Jiki vidi liniju koja počinje sa ove dve kose crte, jednostavno će je preskočiti i preći na sledeću liniju. Ovi komentari ti daju način da pišeš sopstvene beleške. Veoma su korisni da te podsete kako stvari funkcionišu. Često se komentari pišu i za tebe, tako da kada započneš vežbu, oni mogu da ti sugerišu gde treba da napišeš kod ili kako da rešiš nešto. Ali slobodno dodaj i svoje komentare.

Na dnu uputstava za vežbu, videćeš informacije o funkcijama koje možeš da koristiš, tačno koji su ulazi koje treba da uneseš.
