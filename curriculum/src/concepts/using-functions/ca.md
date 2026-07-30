---
title: "Utilitzar funcions"
description: "Digues al Jiki que engegui una de les seves petites màquines: escriu-ne el nom i, tot seguit, els dos parèntesis."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Quan escrius codi, el que fas realment és comunicar què vols que passi en un llenguatge que l'ordinador entén. Hi ha molts llenguatges de programació diferents, i també molts intèrprets diferents que agafen el que escrius i ho converteixen en els uns i zeros que l'ordinador pot entendre. En aquest curs, el teu intèrpret és el Jiki. Tot el curs porta el seu nom. Aquest és el Jiki. El Jiki serà el teu amic en aquest viatge per la programació. La seva feina és interpretar el codi que escrius i convertir-lo en els uns i zeros amb què l'ordinador pot treballar de debò.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="El Jiki, l'intèrpret simpàtic que t'acompanyarà durant tot el curs"
  width="421"
  height="400"
/>

La clau de la programació és donar les instruccions correctes a l'intèrpret, en aquest cas el Jiki. Li pots donar moltes instruccions diferents, i n'entén moltíssimes. Pot enganxar coses, pot fer una cosa moltes vegades seguides, i pot dir: «Si passa això, aleshores he de fer allò». Pot recordar coses i tornar-les a fer servir més endavant. I si alguna cosa no rutlla, et pot donar un error. Durant el curs veurem totes aquestes coses. Però el més important que has d'entendre és que tot el que faràs consisteix a escriure instruccions en una pissarra perquè el Jiki vingui i les segueixi.

Quan vaig aprendre a programar, fa 34 anys, aquest és el model mental que em vaig construir, i encara és el que tinc avui. Entenc com funcionen els ordinadors fins al nivell dels uns i els zeros, però, sincerament, mai no hi penso. Al meu cap, hi ha un homenet que viu dins de l'ordinador, i jo li dic què ha de fer. Així que segueix-me el joc. És un model mental molt potent, i si comences a pensar d'aquesta manera tan visual en què està fent la persona que viu dins de l'ordinador, et servirà molt mentre aprens a programar.

Comencem, doncs, per un dels conceptes fonamentals de la programació: les funcions. Les funcions són com petites màquines que pots demanar al Jiki que faci servir. I si mirem dins del magatzem del Jiki, que és on para, veuràs que té un prestatge amb tres màquines diferents: `move` (mou), `turnLeft` (gira a l'esquerra) i `turnRight` (gira a la dreta).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Un prestatge del magatzem del Jiki amb tres màquines etiquetades move, turnLeft i turnRight"
  width="500"
  height="371"
/>

Quan vas escriure `move` i, tot seguit, els dos parèntesis, li estaves dient al Jiki que anés a buscar la màquina `move` al prestatge, que girés la maneta, la posés en marxa i la fes servir.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="El Jiki traient la màquina move del prestatge per fer-la servir"
  width="439"
  height="400"
/>

Quan vas escriure `turnLeft` i els parèntesis, li deies al Jiki que agafés la màquina `turnLeft` del prestatge i la fes servir. Aquest és el patró que faràs servir una vegada i una altra. Sempre que vulguis fer servir una màquina, n'escriuràs el nom i, tot seguit, els parèntesis: això li diu al Jiki que vagi a buscar la màquina i la faci servir:

```javascript
move()
turnLeft()
```

Com funciona la màquina per dins, què passa exactament dins seu, no ens n'hem de preocupar ara. Ho veurem amb molt més detall més endavant. De fet, ben aviat podràs construir les teves pròpies màquines. Però, de moment, no hi pensis. A cada exercici t'indicarem quines màquines hi ha al prestatge del Jiki. Seran diferents a cada exercici, i les podràs fer servir per resoldre'ls.
