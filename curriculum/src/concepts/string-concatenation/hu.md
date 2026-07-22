---
title: "Stringek összefűzése"
description: "Stringek összeadása a `+` jellel, hogy rögzített szövegből és változókból egyetlen hosszabb string legyen."
en_md5: cac0bfd20259e01238d190126734cc0c
---

Azt már tudod, mi az a string. Papírdarabok, amelyekre szöveg van írva.

Eddig minden string, amit használtál, olyan volt, amit közvetlenül begépeltél.

De mi van akkor, ha egy stringet változók vagy feltételek alapján szeretnél összeállítani? Hogyan csináljuk ezt?

Erre két módszer van.

Az elsőt string-összefűzésnek (_string concatenation_ angolul) hívják, ami csak egy flancos és kicsit zavarba ejtő neve annak, hogy két stringet összeadunk.

Képzeld el, hogy van két szavad, a `"hello"` és a `"world"`, és egy olyan stringet szeretnél létrehozni, hogy `"hello world"`.

Leírhatnád egyszerűen egyetlen stringként, hogy `"hello world"`, de írhatod úgy is, hogy `"hello " + "world"`, és ugyanazt a stringet kapod.

Ebben a helyzetben ez persze nem túl hasznos. De mi van akkor, ha egy változóban valakinek a neve van, és köszönni szeretnénk neki?

Képzeld el, hogy van egy `name` (név) nevű változónk, amiben hol `"Jeremy"`, hol `"Jiki"` áll. Ezt a változót használva szeretnénk azt mondani: `"hello Jeremy"` vagy `"hello Jiki"`.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-concatenation/jiki-name-box.webp"
  alt="Jiki egy name feliratú dobozt tart, amelyben különböző értékek lehetnek"
  width="207"
  height="400"
/>

Nos, ezt pont az összefűzéssel érhetjük el: ha azt írjuk, hogy `"hello " + name`, az eredmény vagy `"hello Jeremy"`, vagy `"hello Jiki"`, vagy hello bárki más lesz, attól függően, hogy mi van a `name` dobozban.

```javascript
"hello " + name
```
