---
title: "Šabloni stringova"
description: "Korišćenje obrnutih apostrofa i `${...}` mesta za ubacivanje vrednosti direktno u string umesto spajanja delova pomoću `+`."
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

Za umetanje stringova u druge stringove možemo da koristimo nešto što se zove šablonski literali (engl. _template literals_).

Umesto da dodajemo stringove jedne na druge, možemo da imamo string ili šablon koji ima mesta za druge stringove.

Za to koristimo obrnute apostrofe (engl. _backticks_) umesto navodnika.

Obrnuti apostrofi su, kao što ime kaže, okrenute kvačice, ali vrlo je moguće da ih nikada ranije nisi koristio, pa moraš da pronađeš pravi taster na tastaturi.

Koristimo ih da napravimo šablon koji može da sadrži druge stringove. A zatim, da umetnemo string u šablon, koristimo još jednu čudnu sintaksu sa dolarima i vitičastim zagradama. Tako na primer, da postignemo isti onaj `"hello " + name` koji smo malopre videli sa spajanjem, mogli bismo da napišemo:

```javascript
`hello ${name}` // "hello Jeremy" or "hello Jiki"
```

<img
class="concept-image"
src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
alt="Jiki drži kutiju sa oznakom „name", vrednost koja se ubacuje u šablon."
width="207"
height="400"
/>

I to radi potpuno istu stvar kao i dodavanje stringova.

Ali kada imaš više stringova koje treba sve ubaciti na jedno mesto, ovo može biti mnogo efikasnije.

Trebaće ti malo vremena da se navikneš na ovu specifičnu sintaksu, ali tu zaista nema ničeg previše komplikovanog.
