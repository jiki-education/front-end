---
title: "Kreiranje i korišćenje promenljivih"
description: "Kutije na Jikijevim policama koje čuvaju vrednost sa etiketom, tako da je kasnije u kodu možeš ponovo izvaditi."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Promenljive (engl. _variables_) nam omogućavaju da čuvamo informacije. Dok programiramo, često treba da sačuvamo neki broj ili neki string da bismo ih kasnije koristili, a tome služe promenljive. Hajde zato da pogledamo Jikijevo skladište iz malo šire perspektive, pa ćeš videti da on ima još jedan niz polica. Prvi niz polica već nam je poznat, na njemu se nalaze funkcije, one male mašine kao što su `move` i `rectangle`. Ali na ovom drugom nizu polica, umesto mašina, vidiš mnoštvo kutija, i te kutije nazivamo promenljivama. Možeš da kažeš Jikiju da u ove kutije smesti bilo šta, a kasnije da mu kažeš da izvadi ono što je u njima. Svaka kutija ima ime, baš kao što ga imaju i funkcije, i svaka kutija sadrži samo jednu stvar. Za sada, to može biti broj ili string. Ali kasnije u kursu ćemo pogledati kako se u njima čuvaju i složenije stvari.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dva niza polica u Jikijevom skladištu: jedan označen za funkcije, sa mašinama, i drugi označen za promenljive, sa kutijama"
  width="500"
  height="173"
/>

Pa kako da kažemo Jikiju da napravi kutiju i nešto stavi u nju? Koristimo ključnu reč `let`. Ključna reč `let` govori Jikiju da treba da napravi novu kutiju. Možeš da ga zamisliš kako uzima novu kartonsku kutiju i sklapa je, a onda pogleda šta stoji posle reči `let`, jer će taj naziv napisati na etiketi kutije, u ovom slučaju `name` (ime). Zatim uzima olovku i na etiketi piše `name`. Onda pogleda šta stoji posle znaka jednakosti (engl. _equal sign_). U ovom slučaju, to je moje ime, `"Jeremy"`, i pošto je `"Jeremy"` string, Jiki uzima parče papira i na njemu piše `"Jeremy"`. To je samo string, baš kao stringovi za boje koje već koristiš, a zatim to parče papira stavlja u kutiju.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki drži parče papira sa napisanim stringom Jeremy, spreman da ga stavi u kutiju"
  width="373"
  height="400"
/>

Dakle, rekli smo mu da napravi kutiju, zalepi etiketu na nju i stavi nešto unutra, i on sada nosi kutiju i stavlja je na policu. Kasnije, u bilo kom trenutku tokom izvršavanja programa, Jiki može da ode po tu kutiju, skine je sa police i pogleda šta je u njoj. Pokušaj da promenljive zamišljaš na ovaj način. Programiram već veoma dugo, i još uvek, dok pišem kod, zamišljam da nešto stavljam u kutiju iz koje ću ga kasnije izvaditi. Kada vidiš ključnu reč `let`, stvarno pomisli: „U redu, to znači da pravim novu kutiju.“

Još nekoliko reči o imenima promenljivih, odnosno etiketama na ovim kutijama. Postoji nekoliko pravila za njihovo imenovanje. Prvo, imena promenljivih ne smeju da sadrže razmake. Ako za etiketu kutije želiš da upotrebiš više reči, pišemo ih spojeno, bez razmaka, a prvo slovo svake sledeće reči velikim slovom. Ovaj način pisanja zovemo camel case. Zamisli da velika slova predstavljaju kamilje grbe koje razdvajaju reči. Dakle, ako želiš etiketu koja znači „moje ime“, na engleskom „my name“, umesto dve reči razdvojene razmakom pišemo ih spojeno, pri čemu druga reč počinje velikim slovom N: `myName`.

Takođe, ime svake promenljive mora da bude jedinstveno. Ne možeš da imaš dve kutije sa istom etiketom, a promenljiva takođe ne sme da ima isto ime kao funkcija. Ako to zaboraviš, Jiki neće znati na šta se ime odnosi, pa će prikazati poruku o grešci.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Zbunjeni Jiki gleda dve kutije koje obe imaju etiketu name"
  width="485"
  height="400"
/>

Hajde sada da pogledamo gde bi promenljiva mogla da nam zatreba. Recimo da crtamo sunce na nebu. Znamo da možemo da upotrebimo funkciju `circle` (krug) i da joj prosledimo četiri ulazne vrednosti: `left` (levo), `top` (gore), `radius` (poluprečnik) i `color` (boja). Ali kako crtamo sve više stvari, postaje veoma teško pratiti sve te brojeve rasute po kodu i razumeti šta predstavljaju. Zato umesto toga možemo da napravimo promenljive za svaku od tih vrednosti, za levu i gornju poziciju, za `radius` i za `color`, i da kasnije koristimo te promenljive. Naš krajnji cilj je, dakle, da možemo da upotrebimo funkciju `circle` i da koristimo jasna i čitljiva imena kutija, a kada Jiki vidi ta imena, znaće da treba da uzme odgovarajuće kutije sa polica i upotrebi vrednosti koje se nalaze u njima.

Hajde da napravimo promenljive za ove vrednosti. Počinjemo od leve pozicije sunca. Ključnom rečju `let` kažemo Jikiju da napravi novu kutiju pod imenom `leftPosition` (leva pozicija). Obrati pažnju na camel case zapis, u kojem je slovo P veliko. I kažemo Jikiju koji broj ide u kutiju. On je stavlja na policu, a zatim isto radi i za `topPosition` (gornja pozicija), `radius` i `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Kutije sa etiketama na policama za promenljive, svaka čuva po jednu vrednost koju će Jiki kasnije doneti"
  width="500"
  height="378"
/>

U bilo kom delu koda možemo da koristimo ove promenljive, a Jiki će izvaditi vrednosti (engl. _values_) iz kutija i proslediti ih mašini. Druga sjajna stvar kod promenljivih je to što, kad god želimo da nacrtamo nešto na istoj poziciji kao sunce, možemo ponovo da iskoristimo te iste promenljive `leftPosition` i `topPosition`. Pogledajmo drugi primer. Zamisli da zidaš zid od 30 cigala i želiš da sve cigle budu iste širine i iste visine. Mnogo je bolje da na početku koda napraviš promenljive za širinu i visinu i da ih koristiš u ostatku koda. Ako kasnije poželiš da promeniš širinu ili visinu, dovoljno je da to uradiš na jednom mestu, i svi delovi koda koji koriste te promenljive će automatski upotrebljavati nove vrednosti.
