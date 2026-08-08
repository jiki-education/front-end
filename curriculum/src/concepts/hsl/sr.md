---
title: "HSL boje"
description: "Pravljenje boja pomoću nijanse (nijansa, 0–360), zasićenja (koliko je živa, 0–100) i osvetljenosti (koliko je svetla, 0–100)."
en_md5: d751e07ccf6b5a58a11d3d2af1026b93
---

HSL nam daje potpuno drugačiji način da razmišljamo o bojama nego RGB. HSL je skraćenica za nijansu (engl. _hue (H)_), zasićenje (engl. _saturation (S)_), i osvetljenost (engl. _lightness (L)_). Imaš funkciju koja se zove `hsl` i koja uzima tri broja: jedan za nijansu, jedan za zasićenje i jedan za osvetljenost, i ona će vratiti boju. Pa, hajde da razložimo šta te tri reči znače.

```javascript
hsl(hue, saturation, lightness)
```

Nijansa je nijansa boje koju želiš, i ide od nule do 360. Možda zamisli dugu. Ovako ja o tome razmišljam. Na levoj strani je crvena, zatim narandžasta, žuta, zelena, plava, ljubičasta, i zapravo, idemo skroz nazad do crvene. Dakle, ako kažeš nula, počinješ sa leve strane, i to je crvena. Ako kažeš `120`, tražiš zelenu. `230` je plava. Možeš o ovome da razmišljaš i kao o krugu boja, što taj broj 360 i jeste. To je broj stepeni u krugu. Ja uvek samo pogledam brojeve koje želim, tako da nemoj previše da brineš o tome da ovo zapamtiš, ali lepo je znati šta se dešava. Eto, to je nijansa. Sledeće imamo zasićenje, što označava koliko je boja živa. Ono ide od nule do 100. Na nuli dobijaš samo sivu. Nema boje, nikakvog tona. Na 100 dobijaš punu, živu, intenzivnu boju. A zatim imamo osvetljenost. Osvetljenost označava koliko je boja svetla, i ono takođe ide od nule do 100. Na nuli dobijaš crnu. Bez obzira koju nijansu si izabrao, dobijaš crnu. U njoj nema svetlosti. A na 100 dobijaš belu. Bez obzira na sve ostalo, puna je svetlosti, pa je bela. 50 je tačno na sredini, normalna boja. Tako da možeš o ovome razmišljati kao o klizaču koji boju čini svetlijom ili tamnijom.

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/hsl-hue-wheel.webp"
  alt="Krug nijansi i duga koji pokazuju da je 0 crvena, 120 zelena, a 240 plava"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/saturation-slider.webp"
  alt="Klizač zasićenja od 0 (siva) preko 50 do 100 (puna živa boja)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/hsl/lightness-slider.webp"
  alt="Klizač osvetljenosti od 0 (crna) preko 50 do 100 (bela)"
  width="500"
  height="398"
/>

Dakle, ako želimo normalan crveni krug, koji bismo napisali kao 255, nula, nula u RGB-u, sve crvene, bez zelene, bez plave, ovde bismo koristili nula, 100, 50. Nula za crvenu nijansu, 100 za zasićenje, punu boju, i 50 za osvetljenost, što je normalan nivo osvetljenosti. Ako želimo da to bude zeleni krug, možemo samo promeniti nijansu na `120`. Ako želimo da bude tamnije zelena, možemo smanjiti osvetljenost na `25`.

```javascript
hsl(0, 100, 50) // red
hsl(120, 100, 50) // green
hsl(120, 100, 25) // dark green
```

Ako želimo da bude manje intenzivna zelena, možemo da smanjimo zasićenje, recimo na `30`.

Ako želiš jarko, vrelo roze, nijansa od oko 300 je roze, a zatim povećamo zasićenje na 100 da dobijemo zaista živu boju, a takođe povećamo i osvetljenost, na oko 60.

HSL je odličan kada želiš da prolaziš kroz boje. Ako želiš dugu, možeš samo da nastaviš da povećavaš nijansu.
