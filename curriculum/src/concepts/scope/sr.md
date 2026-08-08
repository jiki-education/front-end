---
title: "Opseg"
description: "Razumevanje kako vitičaste zagrade stvaraju sopstveni set polica, tako da promenljive traju samo koliko i njihov blok."
en_md5: 4d5fc2d1d304725660102e9aaceea4c3
---

Zamisli kod koji crta krug na različitom mestu svaki put kada se izvrši, a mi želimo da nacrtamo 10 krugova na različitim mestima. Mogli bismo ovo da kombinujemo sa petljom. Ali za one od vas koji pažljivo prate, možda ste primetili nešto čudno ovde.

```javascript
repeat(10) {
  let left = Math.randomInt(0, 100)
  let top = Math.randomInt(0, 100)
  circle(left, top, 5, "blue")
}
```

Ranije sam rekao da postoji pravilo da kutije na Jikijevim policama moraju imati jedinstvena imena,

i ta ključna reč `let` stvara novu kutiju svaki put kada je upotrebiš.

Ali pošto je `let` unutar petlje, Jiki će stvoriti novu kutiju svaki put kada se petlja izvrši.

Pa da li je kod pogrešan, ili se ovde dešava nešto drugo čudno?

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/thinking-jiki.webp"
  alt="Jiki izgleda zbunjeno, pitajući se da li je kod pogrešan"
  width="384"
  height="400"
/>

Pa, ispostavlja se da je kod u redu. Ovo je potpuno validan JavaScript i funkcioniše zahvaljujući konceptu koji se zove opseg (engl. _scope_) ili oblast važenja.

Opseg je nešto što će ti u početku verovatno delovati prilično jednostavno, ali garantujem da će ti zadavati muke do kraja karijere. Čak i najiskusniji programeri nailaze na probleme sa opsegom, a JavaScript je jedan od najkomplikovanijih jezika u tom pogledu. Govorim ti ovo da se, kada budeš nailazio na probleme sa opsegom, ne bi osećao loše. Ali takođe, stvarno obrati pažnju na ovaj deo jer je važan.

Kada u kodu vidiš vitičastu zagradu, ona stvara ono što se zove novi opseg. Šta to znači? Pa, možeš zamisliti kako Jiki u svojoj radionici pravi novi, mali set polica kad god ugleda vitičastu zagradu. I sve kutije koje stvori dok radi, izvršavajući kod unutar tih vitičastih zagrada, te kutije, te nove kutije idu na taj novi, mali set polica, a ne na glavne.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves.webp"
  alt="Jikijev glavni set polica pored novog, manjeg seta polica koji je stvorila vitičasta zagrada"
  width="500"
  height="205"
/>

A kada Jiki dođe do odgovarajuće zatvarajuće vitičaste zagrade, on baca sve kutije koje su na ovom pomoćnom setu polica.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/shelves-loop-end.webp"
  alt="Jiki baca kutije sa pomoćnog seta polica u kantu kada dođe do zatvarajuće vitičaste zagrade"
  width="500"
  height="237"
/>

Dakle, svaki put kada imamo ovakvu petlju, možemo stvoriti kutije koje traju samo koliko jedno izvršavanje petlje. Kutije `left` (levo) i `top` (gore) koje ovde vidiš, one traju samo dok ne stignemo do zatvarajuće vitičaste zagrade, a zatim bivaju bačene. A Jiki stiže do te zatvarajuće zagrade svaki put kada se petlja izvrši. To je, u ovom programu, 10 puta. Dakle, 10 puta će stvoriti kutiju pod nazivom `left`, a zatim će je ponovo baciti.

<img
  class="concept-image"
  src="/static/images/concept-assets/scope/left-top-boxes-color.webp"
  alt="Dve kutije sa natpisima left i top koje traju samo jednu iteraciju petlje"
  width="500"
  height="187"
/>

Dakle, kada kreiraš promenljivu, moraš odlučiti koliko dugo želiš da ostane prisutna. Ako želiš da živi dugo, mora da bude izvan bilo koje vitičaste zagrade. Ako želiš da traje samo jednu iteraciju (engl. _iteration_), jedno izvršavanje petlje, onda je možeš staviti unutar vitičastih zagrada. Vidiš li kako ovo sve može postati pomalo zbunjujuće? Zato jedno lepo pravilo da ovo ostane jednostavno dok tek počinješ jeste da sve svoje promenljive držiš pri vrhu koda, izvan vitičastih zagrada, a zatim ih samo ažuriraš unutar zagrada. Na primer, mogli bismo napisati gornji kod samo sa jednom kutijom `left` i jednom `top` postavljenom na nulu na početku, a zatim ih ažurirati svaki put unutar petlje. I to je potpuno validno. Niti jedno nije ispravno niti pogrešno. Postoje najbolje prakse, ali o njima ćemo učiti kasnije. Za sada, eksperimentiši, zabavi se, vidi šta ti najviše odgovara i pokušaj da ne brineš previše o ovome.
