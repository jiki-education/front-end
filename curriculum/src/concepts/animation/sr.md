---
title: "Animacija"
description: "Zavaravanje oka da vidi pokret tako što se pozadina ponovo boji i svaki frejm se crta u malo izmenjenom položaju."
en_md5: 536994294072afea52dab51d3bb7cab8
---

Do sada, kada smo koristili `repeat` (ponavljanje) petlju za crtanje stvari, svaka nova stvar koju smo nacrtali dodala je nešto slici. Ako smo nacrtali novu ciglu u zidu, popunila je prazninu. Ako smo nacrtali 10 krugova, vidimo 10 krugova na ekranu. To je kao slika. Kada staviš boju na zid, ona ne nestane kada pored nje naslikaš nešto novo. Ostaje tu. Ali šta ako želimo da nešto izgleda kao da se kreće?

Jesi li ikada video flip book? Bili su jako popularni kad sam bio mali, sada manje. Flip book je mala knjiga u kojoj svaka stranica ima malo drugačiji crtež. Kada brzo okrećeš stranice, tvoje oči vide promenu crteža i mozak pomisli da se nešto kreće. Zapravo se ne kreće. To su samo mnogo malo drugačijih slika, jedna za drugom. I upravo tako animacija funkcioniše u kodu. Trik je isti. Pre nego što nacrtamo novu scenu, obojimo celo platno pozadinskom bojom, pomalo kao da počinjemo novu stranicu u našem flip book-u, a zatim napravimo malu izmenu na sceni da bi izgledala kao pokret.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/flip-book-pages.webp"
  alt="Flip book koji prikazuje čovečuljka kako trči, svaka stranica je malo drugačija tako da figura izgleda kao da se kreće"
  width="500"
  height="274"
/>

Ako uzmemo poznati blok koda gde crtamo krugove po ekranu, postavimo promenljivu `position` (pozicija), i imamo `repeat` blok u kome crtamo krug, a zatim pomeramo `position` jedno mesto udesno. Ako pokrenemo taj `repeat` blok 100 puta, videćemo 100 krugova po ekranu.

```javascript
let position = 0
repeat(100) {
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circles-trail.webp"
  alt="Trag od 100 plavih krugova nacrtanih s leva na desno po ekranu"
  width="500"
  height="197"
/>

Sada, pogledaj šta se dešava ako samo dodamo jedan običan pravougaonik pre nego što svaki put nacrtamo krug.

```javascript
let position = 0
repeat(100) {
  rectangle(0, 0, 100, 100, "white")
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

Umesto traga krugova, naše oči su sada prevarene da vide jedan krug koji izgleda kao da klizi po ekranu.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circle-glide-frames.webp"
  alt="Sekvenca frejmova, svaki je sveže belo platno sa jednim plavim krugom koji je za korak udaljeniji udesno"
  width="500"
  height="187"
/>

Svaki put kada prođemo kroz petlju, bojimo celu novu pozadinu, prekrivajući sve što je bilo tu pre, a zatim crtamo krug na njegovom novom mestu.

Svaki prolazak kroz petlju je kao nova stranica u flip book-u.

I ključna stvar koju ovde treba razumeti je da ne pomeramo krug. Krug nije objekat koji klizi. To je samo crtež. Svaki put kroz petlju, bojimo preko starog crteža i pravimo potpuno novi malo udesno. Tvoje oko sve to spaja i vidi pokret, ali zapravo, to su samo mnogo odvojenih crteža, jedan za drugim.

Ovu ideju možeš da iskoristiš za kreiranje zalaska sunca. Pusti da se sunce kreće, promeni njegovu veličinu, promeni njegovu boju. Sve je to ista tehnika. Postavi nekoliko promenljivih, oboji svežu pozadinu i nacrtaj sve. Ažuriraj promenljive, a zatim ponovi.
