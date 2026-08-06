---
title: "Dugina lopta"
description: "Napravi loptu koja odskače i iscrtava dugin trag po platnu."
en_md5: 501aa30e85d8fceb38890c72be4a0b87
---

Tvoj zadatak je da napraviš loptu koja nasumično odskače po platnu, iscrtavajući dugu za sobom.

Trebalo bi da izgleda otprilike ovako:

<img src="/static/images/exercise-assets/rainbow-ball/example.gif" alt="Animacija duge lopte koja odskače po platnu ostavljajući šareni trag" style="width: 100%; max-width: 200px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Kao deo ove vežbe, imaš funkciju `Math.randomInt(min, max)` (nasumični ceo broj) koja vraća nasumični ceo broj između `min` i `max` koje joj proslediš.

Odvoji nekoliko minuta da razmisliš kako bi mogao da rešiš ovo. Ovo je najvažniji deo vežbe, zato ne žuri i **zapiši svoje ideje pre nego što pročitaš formulu ispod.**

Kada stekneš predstavu o svom pristupu, nastavi sa čitanjem. Ali nemoj čitati dalje dok ne provedeš malo vremena razmišljajući!

## Formula

Ovaj projekat se u potpunosti svodi na to da imaš nekoliko promenljivih koje su odgovorne za položaj lopte, a koje se stalno povećavaju ili smanjuju. I druge promenljive koje kontrolišu **kako** se lopta kreće i menjaju se kada su ispunjeni određeni uslovi.

### Crtanje

- Prvi krug koji nacrtaš treba da bude na `(5, 5)`.
- Svi krugovi treba da imaju poluprečnik `10`.
- Boja kruga treba da koristi HSL, počevši sa nijansom `100` (zelena), zasićenošću `80` (jake boje) i osvetljenošću `50` (srednja osvetljenost).

### Animiranje

- Za početak, u svakoj iteraciji treba da pomeriš loptu `2` udesno i `1` naniže.
- Nijansa treba da se povećava za `1` svaki put, sve dok ne dostigne maksimum (`360`), a zatim treba ponovo da se smanjuje. Zasićenje i osvetljenost ne moraju da se menjaju.

### Odbijanje

- Kada lopta stigne do ivice platna, treba da promeni smer. (Pogledaj nagoveštaje ako ne možeš da smisliš kako ovo da uradiš.)
- Da bi stvar bila još zanimljivija, treba da menjaš smer pomoću funkcije `Math.randomInt(min, max)`. Izaberi `min` (minimalnu vrednost) i `max` (maksimalnu vrednost) koje daju stil animacije koji želiš.

## Da bi prošao provere

U ovoj vežbi smo ti dali dosta slobode. Proveravamo sledeće:

- Prvih nekoliko krugova su tačni.
- Više od 80% platna bude obojeno.

Brojevi koje odabereš da bi to postigao su na tebi. Verovatno ćeš želeti repeat blok koji iterira između `500` i `1000` puta.

## Razloži ga...

Ključ ove vežbe je da radiš stvari jednu po jednu:

1. Neka lopta menja boju dok se kreće
2. Neka odbija od desne strane
3. Neka odbija od donje strane.
4. Neka odbija nasumično
