---
title: "Pomeri se i pucaj"
description: "Pomeraj se kroz Space Invaders i eliminiši vanzemaljce."
en_md5: a238bdc121bdfe425015d2e9e6b872d5
---

Vraćamo se na Space Invaders. Poslednji put si samo trebalo da se pomeraš levo-desno kako bi oborio sve vanzemaljce. Ali ovog puta takođe treba da odbijaš laser s leva na desno, praveći više prolaza da bi oborio vanzemaljce.

Možeš pomerati laser levo i desno pomoću funkcija `moveLeft()` (pomeranje levo) i `moveRight()` (pomeranje desno). Možeš eksperimentisati da vidiš koliko daleko levo i desno možeš da se pomeriš. Ako odeš van ivice ekrana, gubiš.

Kao i ranije, kada se pomeriš, treba da proveriš da li se iznad tebe nalazi vanzemaljac pomoću funkcije `isAlienAbove()` (provera da li je vanzemaljac iznad) i, ako se nalazi, da ga upucaš pomoću `shoot()` (pucanje). Ako pucaš kad nema vanzemaljca, gubiš igru, jer trošenje municije nije dozvoljeno!

Laserski top se lako pregreva. Moraš se pomerati između hitaca da bi ga rashladio.

Talasi postaju sve zahtevniji kako napreduješ. U poslednjem talasu vanzemaljci se iznova pojavljuju, tako da ne možeš unapred znati koliko će ti hitaca biti potrebno, i tvoja petlja mora da radi sve dok svi vanzemaljci ne budu uništeni.

Jedno pravilo ove vežbe, da bi prošao poslednji scenario, jeste da ne smeš koristiti `repeat` petlju sa brojem ponavljanja (tj. **možeš** koristiti `repeat() { ... }`, ali **ne smeš** koristiti `repeat(10) { ... }`).

Kad svi vanzemaljci budu oboreni, pobeđuješ! Srećno!
