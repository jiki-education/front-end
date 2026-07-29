---
title: "Stringek összefűzése"
description: "Stringek összeadása a `+` jellel, hogy rögzített szövegből és változókból egyetlen hosszabb string legyen."
en_md5: 0e6c7a941a1fb1161445da27a4d7e818
---

Azt már tudod, mi az a string. Papírdarabok, amelyekre szöveg van írva.

Eddig minden string, amit használtál, olyan volt, amit közvetlenül begépeltél. De mi van akkor, ha egy stringet változók vagy feltételek alapján szeretnél összeállítani? Hogyan csináljuk ezt?

Erre két módszer van.

Az elsőt string-összefűzésnek (_string concatenation_ angolul) hívják, ami csak egy flancos és kicsit zavarba ejtő neve annak, hogy két stringet összeadunk.

Képzeld el, hogy van két szavad, a `"hello"` (helló) és a `"world"` (világ), és egy olyan stringet szeretnél létrehozni, hogy `"hello world"`.

Leírhatnád egyszerűen egyetlen stringként, hogy `"hello world"`, de írhatod úgy is, hogy `"hello " + "world"`, és ugyanazt a stringet kapod.

Ebben a helyzetben ez persze nem túl hasznos. De mi van akkor, ha egy változóban valakinek a neve van, és köszönni szeretnénk neki?

Képzeld el, hogy van egy `name` (név) nevű változónk, amiben hol a `"Jeremy"` (a Jeremy név), hol a `"Jiki"` (a Jiki név) áll. Ezt a változót használva szeretnénk azt mondani: `"hello Jeremy"` vagy `"hello Jiki"`.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki egy name feliratú dobozt tart, amelyben különböző értékek lehetnek"
  width="207"
  height="400"
/>

Nos, ezt pont az összefűzéssel érhetjük el:

```javascript
"hello " + name // "hello Jeremy" vagy "hello Jiki"
```

Az eredmény vagy `"hello Jeremy"`, vagy `"hello Jiki"`, vagy hello bárki más lesz, attól függően, hogy mi van a `name` dobozban.
