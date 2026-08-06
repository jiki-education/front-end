---
title: "Felirat ára"
description: "Számold ki, mennyibe kerül egy felirat lefestése betűnként."
en_md5: 67d90aae9a896a879c20956e9afc9270
---

Egy feliratkészítő műhelyt vezetsz. Minden feliratért betűnként 12 dollárt számolsz fel. A szóközök ingyenesek (semmibe sem kerülnek).

Írj egy `signPrice` (a felirat ára) nevű függvényt, ami bemenetként megkapja a felirat szövegét, és visszaad egy formázott stringet a teljes árral. A string a `"That will cost "` (ez annyiba kerül) szövegből áll, amit az ár követ. Például:

- `signPrice("Burgers")` (7 betű) ezt adja vissza: `"That will cost $84"`
- `signPrice("Frank's Hotdogs")` (14 betű, szóközöket kihagyva) ezt adja vissza: `"That will cost $168"`

Jó szórakozást!
