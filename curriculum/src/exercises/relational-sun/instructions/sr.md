---
title: "Relaciono sunce"
description: "Postavi sunce tako da je sve izračunato iz promenljivih."
en_md5: d8de4704a25f3733ddaaea16f0232005
---

U ovoj vežbi, tvoj zadatak je da postaviš sunce u gornji desni ugao neba koristeći aritmetiku i promenljive. Ključno ograničenje je da ivica sunca uvek bude na fiksnom **razmaku** od ivice platna, bez obzira na veličinu sunca.

Unapred smo postavili četiri promenljive (engl. _variables_) za tebe na vrhu fajla:

- `canvasSize` (veličina platna): veličina platna, što je `100`.
- `color` (boja): postavljena na `"yellow"`.
- `gap` (razmak): koliko je ivica sunca udaljena od gornje i desne ivice platna.
- `radius` (poluprečnik): poluprečnik sunca.

### Proces u dva koraka

Da rešiš ovu vežbu, uradi dve stvari:

#### 1. Definiši izvedene promenljive

Definiši promenljive `sunX` (x-koordinata) i `sunY` (y-koordinata) koje koriste `gap`, `radius` i `canvasSize` da postave centar sunca u gornji desni ugao.

#### 2. Nacrtaj krug

Nacrtaj krug koristeći `sunX`, `sunY`, `radius` i `color`.

## Fleksibilnost

`gap` je podrazumevano postavljen na 10, a `radius` na 15. Prvo reši vežbu koristeći te vrednosti, tako da možeš da koristiš pozadinu da poravnaš stvari. Kada tvoj kod bude ispravan, videćeš krug na pravom mestu na stranici.

Međutim, da bi prošao vežbu, ne možeš samo da 'fiksiraš' vrednost (što znači da je postaviš na jedan broj); `sunX` i `sunY` moraju biti izračunavanja koja uključuju druge promenljive.

Kada prođeš vežbu, klikni na 'Tidy my code' i probaj da promeniš vrednosti za `gap` i `radius` na vrhu fajla, pa ponovo pokreni svoj kod da vidiš kako sunce raste ili se pomera, a i dalje ostaje u uglu.

Kada završiš, možeš da klikneš na 'Dashboard' u gornjem desnom uglu da nastaviš kao i obično.
