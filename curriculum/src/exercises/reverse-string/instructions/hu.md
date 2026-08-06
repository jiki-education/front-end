---
title: "Karakterlánc megfordítása"
description: "Fordíts meg egy szöveget visszafelé!"
en_md5: 9d47faf87b2864284ed64ce1300073ea
---

A karakterláncok megfordítása (vagyis jobbról balra, nem a megszokott balról jobbra irányban olvasva) meglepően gyakori feladat a programozásban.

Például a bioinformatikában a DNS- vagy RNS-szekvenciák megfordítása gyakran fontos különböző elemzésekhez, például komplementer szálak kereséséhez vagy palindrom szekvenciák azonosításához.

Feladatod, hogy hozz létre egy `reverse` (megfordít) nevű függvényt, amely egy karakterláncot kap bemenetként, és visszaadja a megfordított változatát.

Példák:

- A "stressed" szóból "desserts" lesz.
- A "strops" szóból "sports" lesz.
- A "racecar" szóból "racecar" lesz (palindrom).

### Az utolsó két forgatókönyv furcsa, igaz?

Mi történik itt?

Kiderül, hogy rengeteg emoji valójában több másik emojiból áll össze, amelyeket láthatatlan (nulla szélességű) szóközök kapcsolnak össze.

A család emoji (👩‍👩‍👧‍👦) két nőből és két gyermekből áll össze. Amikor megfordítod, láthatod az egyes karaktereket (👦‍👧‍👩‍👩).

A másik egy szivárvány és egy zászló (🌈‍️🏳). Ha megfordítod a sorrendet, és előbb a zászló, aztán a szivárvány jön, akkor szivárványzászló (🏳️‍🌈️) lesz belőle!

Ha karakterenként építed fel az eredményt, ezek gond nélkül működnek. Ha viszont valami ravaszabb trükkhöz nyúlsz, előfordulhat, hogy az emojik szétesnek.
