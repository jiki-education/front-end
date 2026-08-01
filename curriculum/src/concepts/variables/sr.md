---
title: "Pravljenje i korišćenje promenljivih"
description: "Kutije na Jikijevim policama koje čuvaju vrednost sa etiketom, tako da je kasnije u kodu možeš ponovo izvaditi."
en_md5: 6fca9aed7a4f51de337288e739f8b44a
---

Promenljive (engl. _variables_) su ono što nam omogućava da čuvamo informacije. Dok programiramo, često treba da sačuvamo neki broj ili neki string da bismo ih kasnije koristili, a promenljive su način na koji to radimo. Hajde zato da pogledamo Jikijevo skladište iz malo šire perspektive, pa ćeš videti da on ima još jedan komplet polica. Prvi komplet polica nam je već poznat, na njemu stoje funkcije, one male mašine kao što su `move` i `rectangle`. Ali na ovom drugom kompletu polica, umesto mašina, vidiš mnoštvo kutija, i te kutije su ono što zovemo promenljive. Možeš da kažeš Jikiju da u ove kutije smesti bilo šta, a kasnije da ga zamoliš da to ponovo izvadi. Svaka kutija ima ime, potpuno isto kao što i funkcije imaju ime, i svaka kutija sadrži samo jednu stvar. Za sada, ili broj ili string. Ali kasnije u kursu ćemo pogledati kako se u njima čuvaju i složenije stvari.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dva kompleta polica u Jikijevom skladištu: jedan označen za funkcije, sa mašinama, i drugi označen za promenljive, sa kutijama"
  width="500"
  height="173"
/>

Pa kako da kažemo Jikiju da napravi kutiju i nešto stavi u nju? Koristimo ključnu reč `let` (neka). Ključna reč `let` govori Jikiju da treba da napravi novu kutiju. Možeš da ga zamisliš kako raspakuje kartonsku kutiju iz omota i sklapa je, a onda pogleda šta stoji posle reči `let`, i to je etiketa koju lepi na kutiju, u ovom slučaju `name` (ime). Zato vadi svoju olovku i na etiketi piše `name`. Onda pogleda šta stoji posle znaka jednakosti (engl. _equal sign_). U ovom slučaju, to je moje ime, `"Jeremy"`, i pošto je `"Jeremy"` string, Jiki uzima parče papira i na njemu piše `"Jeremy"`. To je samo string, potpuno isto kao boje sa kojima već radiš, a zatim to parče papira stavlja u kutiju.

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

Dakle, rekli smo mu da napravi kutiju, zalepi etiketu na nju i stavi nešto unutra, i on sada nosi kutiju i ostavlja je na policu. A onda, u bilo kom drugom trenutku u tvom programu, Jiki može da ode po tu kutiju, skine je sa police i pogleda šta je u njoj. Počni da gradiš ovaj mentalni model. Programiram već čitavu večnost, i još uvek, dok pišem kod, zamišljam da nešto stavljam u kutiju iz koje ću ga kasnije izvaditi. Kada vidiš ključnu reč `let`, stvarno pomisli: „U redu, to znači da pravim novu kutiju.“

Još nekoliko reči o imenima promenljivih, etiketama na ovim kutijama. Za njih imamo par pravila. Prvo, imena promenljivih ne smeju da sadrže razmake. Ako za etiketu kutije želiš da upotrebiš više reči, spajamo reči jednu uz drugu, a prvo slovo svake sledeće reči pišemo velikim slovom. Ovo zovemo camel case. Zamisli kamilje grbe kako izdižu prvo slovo svake nove reči u veliko slovo. Dakle, ako želiš etiketu koja znači „moje ime“, na engleskom „my name“, umesto dve reči razdvojene razmakom pišemo jednu reč sa velikim N: `myName`.

Takođe, ime svake promenljive mora da bude jedinstveno. Ne možeš da imaš dve kutije sa istom etiketom, a promenljive ne mogu ni da imaju isto ime kao funkcije. Ako to zaboraviš, Jiki će se zbuniti i prijaviće ti grešku.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Zbunjeni Jiki gleda dve kutije koje obe imaju etiketu name"
  width="485"
  height="400"
/>

Hajde sada da pogledamo gde bi promenljiva mogla da nam zatreba. Recimo da crtamo sunce na nebu. Znamo da možemo da upotrebimo funkciju `circle` (krug) i da joj damo četiri ulaza: `left` (levo), `top` (gore), `radius` (poluprečnik) i `color` (boja). Ali kako crtamo sve više stvari, svi ti brojevi rasuti po kodu postaju zaista teški za praćenje i čitanje. Zato umesto toga možemo da napravimo promenljive za svaku od tih vrednosti, za levu i gornju poziciju, za `radius` i za `color`, i da se kasnije pozivamo na te promenljive. Naš krajnji cilj je, dakle, da možemo da upotrebimo funkciju `circle` i navedemo lepa, čitljiva imena kutija, a kada Jiki vidi ta imena, znaće da treba da uzme kutije sa polica i iskoristi ono što je u njima.

Hajde da napravimo promenljive za ovo. Počinjemo od leve pozicije sunca. Ključnom rečju `let` kažemo Jikiju da napravi novu kutiju pod imenom `leftPosition` (leva pozicija). Primeti camel case, sa velikim P. I kažemo Jikiju koji broj ide u kutiju. On je stavlja na police, a zatim isto radi i za `topPosition` (gornja pozicija), `radius` i `color`.

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

U bilo kom trenutku u kodu možemo da se pozovemo na ove promenljive, a Jiki će izvaditi vrednosti (engl. _values_) i staviti ih u mašinu. Druga sjajna stvar kod promenljivih je to što, kad god želimo da nacrtamo nešto na istoj poziciji kao sunce, možemo ponovo da iskoristimo te iste promenljive `leftPosition` i `topPosition`. Uzmi drugačiji primer. Zamisli da zidaš zid od 30 cigala i želiš da sve cigle budu iste širine i iste visine. Mnogo je bolje da na početku koda napraviš promenljive za širinu i visinu i da se na njih pozivaš u ostatku koda. Jer ako kasnije poželiš da promeniš širinu ili visinu, dovoljno je da to uradiš na jednom mestu, i sve ostalo će se ažurirati.
