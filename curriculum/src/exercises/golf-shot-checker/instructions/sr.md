---
title: "Provera udarca"
description: "Odredi da li je golf udarac završio dovoljno blizu da uđe."
en_md5: 0585e8c489eca5a11da4df955e647456
---

Ponovo te pozdravljam na golf terenu. Do sada samo kotrljaš loptu horizontalno. Kada dođe do rupe, samo stoji iznad nje. Sada ćemo je zaista animirati dole u rupu.

Prva promena je ta da funkcija `moveTo` (pomeri do) sada ima ulaze za `x` (horizontalna koordinata) i `y` (vertikalna koordinata). Kao i ranije, moraš da je kotrljaš jedan po jedan korak, a ne da je jednostavno prebaciš na kraj. Ali ovog puta, ako golfer ubaci loptu u rupu, moraš da animiraš i taj završni deo, pomerajući loptu dole u rupu nakon što je stigla na pravo mesto.

Zatim, konačno, **ako lopta završi u rupi**, kada se dokotrlja do dna, vreme je za slavlje, pa ispali neke vatromete koristeći funkciju `fireFireworks()` (pokreni vatromet).

Nekoliko stvari koje treba da znaš:

1. Lopta kreće sa tija na `x = 28`, `y = 75` i kotrlja se jedan po jedan korak.
2. Uspešan udarac znači da je dužina udarca `58`, `59`, `60`, `61` ili `62`.
3. Moraš da skotrljaš loptu dole za `9` jedinica.

Na ovoj vežbi, probaj pažljivo da promisliš svaki korak i idi korak po korak. Srećno!
