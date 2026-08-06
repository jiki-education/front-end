---
title: "Aritmetika"
description: "Kombinovanje promenljivih s matematikom tako da vrednosti mogu biti u vezi i zavisiti jedna od druge pomoću sabiranja, oduzimanja, množenja i deljenja."
en_md5: 7ce54754a3ca29896609a01a51b12377
---

Do sada, kada smo kreirali promenljive, koristili smo samo jednostavne vrednosti; broj poput `50` ili string poput `"yellow"`. Promenljive postaju mnogo moćnije kada ih možemo koristiti u kombinaciji jedna s drugom. Na primer, kada možemo reći da leva ivica pravougaonika treba da bude na određenoj udaljenosti od ivice platna.

U programiranju možemo da koristimo običnu, osnovnu matematiku, to jest sabiranje, oduzimanje, množenje i deljenje, i možemo da koristimo promenljive koje smo već definisali kao deo toga.

Hajde da počnemo tako što ćemo reći da želimo da nacrtamo pravougaonik na našem platnu, i želimo da on počne 10 unutra od leve i desne ivice, i 20 unutra od gornje i donje ivice. Dakle, biće na sredini platna, malo duži nego što je visok.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/rectangle-on-canvas.webp"
  alt="Plavi pravougaonik centriran na platnu, 10 unutra od leve i desne ivice i 20 unutra od gornje i donje ivice"
  width="399"
  height="400"
/>

Kada crtamo pravougaonik, moramo da znamo njegov `left` (levo), `top` (vrh), `width` (širina) i `height` (visina), kao i njegovu boju. Možemo početi tako što ćemo to zapisati.

A sada treba da izračunamo koliki bi njegov `left`, `top`, `width` i `height` trebalo da budu. Hajde da ih postavimo. `Left` je 10. `Top` je 20. `Width`, pa, `width` je veličina platna, koja je 100, minus 10 sa leve i 10 sa desne strane, dakle to je 80. A `height` je visina platna, takođe 100, minus 20 na vrhu i 20 na dnu, dakle 60.

```javascript
let left = 10
let top = 20
let width = 80
let height = 60

rectangle(left, top, width, height, "blue")
```

Dakle, možemo postaviti te promenljive. `Left` 10, `top` 20, `width` 80, `height` 60. Ali šta se dogodi sada ako želimo da pomerimo pravougaonik malo unutra, da bude malo manji? Ako želimo da ga pomerimo 20 od leve i desne ivice i 30 od gornje i donje ivice? Morali bismo ponovo sve da izračunamo. `Width` je sada 100 minus 20 minus 20, a `height` je 100 minus 30 minus 30, i ovo je definitivno više posla i više matematike nego što ja želim da radim.

Umesto toga, možemo reći računaru da to uradi za nas.

Možemo postaviti `width` da bude 100 minus `left` minus `left`, a `height` da bude 100 minus `top` minus `top`, jer je isto na vrhu i na dnu. Ili bismo to mogli zapisati kao 100 minus `left` puta dva, ili 100 minus `top` puta dva.

```javascript
let width = 100 - left * 2
let height = 100 - top * 2
```

I sada ako promenimo `left` ili `top`, `width` i `height` će se takođe promeniti. Tako stvari počinju da zavise jedna od druge. A šta ako se promeni platno? Sada je 100. Ali šta ako naše platno postane široko i visoko 200? Pa, verovatno bismo trebali da postavimo promenljivu pod nazivom `canvasSize` (veličina platna) i da joj dodelimo vrednost 100. I sada je naš `width` jednak `canvasSize` minus `left` puta dva, a `height` jednak `canvasSize` minus `top` puta dva.

```javascript
let canvasSize = 100
let left = 20
let top = 30
let width = canvasSize - left * 2 // 60
let height = canvasSize - top * 2 // 40

rectangle(left, top, width, height, "blue")
```

Hajde da razmislimo šta Jiki radi kada napišemo let `height` equals `canvasSize` minus `top` puta dva. Pa, on prvo uzima kutiju `top` sa police, i u njoj pronalazi 30, zatim vadi svoj džepni kalkulator i računa 30 puta dva, i pravi mentalnu belešku da je to 60.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-1.webp"
  alt="Jiki uzima kutiju top sa police i računa 30 puta dva, što je 60"
  width="377"
  height="400"
/>

Zatim uzima kutiju `canvasSize` sa police, pronalazi u njoj 100, i izračunava da je 100 minus 60 jednako 40. I sada on zaista shvata da je ono što govorimo "neka `height` bude 40". Dakle, on posluša let: uzima novu kutiju, na nju napiše `height`, a zatim unutra stavlja 40. I kasnije, kada koristi `height`, on jednostavno ponovo izvadi taj 40.

<img
  class="concept-image"
  src="/static/images/concept-assets/arithmetic/flow-of-images-3.webp"
  alt="Jiki uzima novu kutiju, na nju piše height, i unutra stavlja 40"
  width="462"
  height="400"
/>

Kada sve bude radilo u vežbi, poigraj se menjanjem vrednosti promenljivih i vidi šta se dešava. Gledaj kako rastu i kako se smanjuju. Ne žuri, razmisli o odnosima između stvari.
