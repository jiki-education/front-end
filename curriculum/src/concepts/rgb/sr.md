---
title: "RGB boje"
description: "Mešanje crvene, zelene i plave svetlosti od 0 do 255 da napraviš bilo koju boju koju želiš na ekranu."
en_md5: 8ed038f6d17072b6fb6eaae6bef15c2c
---

RGB nam omogućava da o bojama razmišljamo kao o mešavini crvene, zelene i plave. To je ono što RGB znači: crvena (engl. _red (R)_), zelena (engl. _green (G)_), plava (engl. _blue (B)_). Ako se sećaš mešanja boja u školi, to je slična ideja, samo što umesto boje, mešamo svetlost.

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-mixing-circles.webp"
  alt="Tri preklapajuća kruga crvene, zelene i plave svetlosti koji se mešaju da naprave žutu, magentu, cijan i belu"
  width="500"
  height="390"
/>

U mnogim vežbama, imaćeš funkciju koja se zove `rgb(red, green, blue)`, i ona će uzeti tri broja kao svoje ulaze: jedan za crvenu, jedan za zelenu, jedan za plavu, i vratiće boju.

Brojevi koje možeš da koristiš kao ulaze idu od nule do `255`. Nula znači da ne želiš ni malo te boje, a `255` znači da umešaš što je više moguće te boje. Znači, ako upotrebimo funkciju `rgb` sa `255`, nulom i nulom kao ulazima, ono što kažemo je: želim svu crvenu. Seti se da je `255` najveći broj koji možeš da staviš tamo. Ali ne želimo ni zelenu ni plavu, tako da su te dve nule. Tako dobijamo crvenu, i možemo da sačuvamo tu crvenu u promenljivu, a zatim da je upotrebimo u funkciji `circle` baš kao što smo već radili sa imenovanim stringovima. A šta ako upotrebimo funkciju `rgb` sa nulom, `255`, nulom? Sada kažemo: bez crvene, sva zelena, bez plave. Tako dobijamo zeleni krug. A šta ako želimo žutu? Žuta je mešavina crvene i zelene. Zato možemo reći: daj mi svu crvenu, svu zelenu i bez plave, i to će nam dati žutu. I možemo da koristimo manje brojeve. Ako želimo malo crvene, bez zelene i puno plave, dobićemo ljubičastu. A puno crvene, malo zelene, malo više plave, to daje roze. To je, dakle, RGB. Mešamo crvenu, zelenu i plavu da dobijemo različite kombinacije.

```javascript
rgb(255, 0, 0) // crvena
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-red.webp"
  alt="Crveni krug dobijen pomoću rgb(255, 0, 0), sva crvena bez zelene i plave"
  width="436"
  height="400"
/>

```javascript
rgb(255, 255, 0) // žuta
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-yellow.webp"
  alt="Žuti krug dobijen pomoću rgb(255, 255, 0), sva crvena i sva zelena bez plave"
  width="436"
  height="400"
/>

```javascript
rgb(230, 50, 170) // roze
```

<img
  class="concept-image"
  src="/static/images/concept-assets/rgb/rgb-pink.webp"
  alt="Roze krug dobijen pomoću rgb(230, 50, 170), puno crvene, malo zelene i malo plave"
  width="436"
  height="400"
/>

RGB je odličan kad želiš da podesiš jednu određenu komponentu: koliko crvene, koliko zelene, koliko plave.
