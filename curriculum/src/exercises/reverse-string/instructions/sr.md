---
title: "Obrnuti string"
description: "Obrni string unazad."
en_md5: 9d47faf87b2864284ed64ce1300073ea
---

Obrtanje stringova (čitanje s desna na levo, umesto s leva na desno) je iznenađujuće čest zadatak u programiranju.

Na primer, u bioinformatici, obrtanje sekvence DNK ili RNK stringova često je važno za različite analize, poput pronalaženja komplementarnih lanaca ili identifikacije palindromskih sekvenci.

Tvoj zadatak je da kreiraš funkciju pod nazivom `reverse` (obrnuti), koja uzima string kao ulaz i vraća obrnutu verziju.

Primeri:

- Pretvori "stressed" u "desserts"
- Pretvori "strops" u "sports"
- Pretvori "racecar" u "racecar" (palindrom)

### Ta poslednja dva scenarija...

Zadnja dva scenarija izgledaju čudno, zar ne? Šta se dešava?

Ispostavlja se da je mnogo emodžija zapravo sastavljeno od drugih emodžija spojenih skrivenim (nulte širine) razmacima.

Porodični emodži (👩‍👩‍👧‍👦) sastoji se od dve žene i dvoje dece. Kada se obrne, mogu se videti pojedinačni karakteri (👦‍👧‍👩‍👩).

Onaj drugi je duga i zastava (🌈‍️🏳). Kada obrneš redosled tako da prvo bude zastava pa duga, postaje dugina zastava (🏳️‍🌈️)!

Ako gradiš svoj rezultat jedan po jedan karakter, ovo bi trebalo da radi. Ako umesto toga posegneš za pametnijim trikom, mogao bi da otkriješ da se emodžiji raspadnu.
