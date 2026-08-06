---
title: "Collatzova hipoteza"
description: "Istraži čuvenu matematičku zagonetku pomoću svoje funkcije."
en_md5: e4f7ab61c163cdb7c2eb2b6541a2cedc
---

Jedne večeri nailaziš na staru svesku ispunjenu zagonetnim škrabotinama, kao da je neko opsesivno jurio neku ideju. Na jednoj stranici isticao se jedan jedini pitanje: **Može li svaki broj pronaći svoj put do 1?** Bilo je povezano s nečim što se zove **Collatzova hipoteza**, zagonetkom koja decenijama zbunjuje mislioce.

Pravila su varljivo jednostavna:

1. Izaberi broj.
2. Ako je paran, podeli ga sa 2.
3. Ako je neparan, pomnoži ga sa 3 i zatim dodaj 1.
4. Ponavljaj sa dobijenim rezultatom, nastavljajući unedogled.

Na primer, počevši od 12:

```
12 → 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1
```

Računajući od drugog broja (6), trebalo je 9 koraka da bi se stiglo do 1.

Napravi funkciju pod imenom `collatzSteps` (broj koraka) koja prima jedan ulaz, broj. Vrati **koliko koraka** je potrebno da se od bilo kog datog broja stigne do 1, prateći pravila Collatzove hipoteze.
