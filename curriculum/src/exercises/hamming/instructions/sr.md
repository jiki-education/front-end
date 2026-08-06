---
title: "Hamming"
description: "Izbroj razlike između dva DNK lanca."
en_md5: 629f74899d402283c34d3bfbb17777b8
---

Ovo je klasična Exercism vežba o molekularnoj biologiji!

Tvoje telo se sastoji od ćelija koje sadrže DNK. Te ćelije se redovno troše i treba ih zameniti, što postižu deobom na ćerke ćelije. Zapravo, prosečno ljudsko telo doživi oko 10 kvadriliona deoba ćelija tokom života!

Kada se ćelije dele, i njihova DNK se replicira. Ponekad tokom tog procesa dođe do grešaka i pojedinačni delovi DNK se kodiraju sa pogrešnom informacijom. Ako uporedimo dva lanca DNK i izbrojimo razlike između njih, možemo da vidimo koliko je grešaka nastalo. To je poznato kao „Hammingovo rastojanje”.

Hammingovo rastojanje je korisno u mnogim oblastima nauke, ne samo u biologiji, pa je dobro biti upoznat sa tim izrazom!

Tvoj zadatak je da izračunaš Hammingovo rastojanje između dva DNK lanca. DNK koristi slova C, A, G i T. Dva lanca mogu da izgledaju ovako:

    GAGCCTACTAACGGGAT
    CATCGTAATGACGGCCT
    ^ ^ ^  ^ ^    ^^

Imaju 7 razlika, i stoga je Hammingovo rastojanje 7.

Kreiraj funkciju pod nazivom `hammingDistance` (Hammingovo rastojanje) koja ima dva ulaza: dva DNK lanca kao stringove. Treba da vrati broj kao rastojanje.

Oba DNK lanca će uvek biti iste dužine.
