---
title: "Else if"
description: "`else if`-ek láncba fűzése, hogy több feltételt ellenőrizz sorban; mindig csak az első igaz feltételhez tartozó blokk fut le."
en_md5: 96538d46967e3b9e757e091b0a33c359
---

Már láttad, hogy az if és az else két utat kínál: ha a feltétel igaz, az egyik dolog történik, ha hamis, a másik. De mi van akkor, ha kettőnél több lehetőséged van?

Képzeld el, hogy a kidobónk most jegyeket árul. Tizenhárom év alatt gyerekjegyet kapsz. Tizenhárom és húsz között ifjúsági jegyet. Húsz évesen vagy afölött pedig felnőttjegyet. Vagyis most már három különböző kimenetel van. Ehhez az else után hozzáadhatunk még egy elágazást (if statement). Mondhatjuk tehát azt, hogy: „Ha ez igaz, csináld ezt. Ha nem, de emez igaz, csináld azt. Különben pedig csináld ezt a harmadikat." Ebben a példában Jiki meglátja az if-et, és ellenőrzi az első feltételt. Kisebb-e a tizenhat tizenháromnál? Nem. Így továbblép az else if-hez. Kisebb-e a tizenhat húsznál? Igen, ez igaz. Lefuttatja hát azt a blokkot, és ifjúsági jegyet ad. Ezzel viszont végzett is. Semmi mást nem ellenőriz. Az utolsó else-t meg sem nézi. Amint Jiki talál egy igaz feltételt, lefuttatja a hozzá tartozó blokkot, és minden alatta lévőt átugrik.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else-if/tickets.webp"
  alt="Három jegy CHILD, TEEN és ADULT felirattal, egy-egy az életkor-ellenőrzés minden lehetséges kimeneteléhez"
  width="500"
  height="142"
/>

Ez itt a lényeg: mindig csak egyetlen blokk fut le. Jiki végigmegy ezen a láncon, megkeresi az első igaz feltételt, lefuttatja a hozzá tartozó blokkot, és továbblép.

Van itt még valami, amit fontos igazán megérteni, mert sokan ezen csúsznak el. Finom, de nagyon fontos különbség van aközött, hogy két külön elágazást írsz, vagy else if-et használsz. Képzeld el, hogy olyan programot írunk, amely valakinek a pontszáma alapján vagy egy alapnyereményt, vagy egy bónusznyereményt ad. Nézd meg ezt a két lehetőséget: az egyik else if-et használ, a másik két külön if-et. Mi történik másképp?

Az első esetben, az else if-fel, ellenőrizzük, hogy magas-e a pontszám, kiadjuk a bónusznyereményt, az else pedig már nem fut le. Vagyis aki száz pont fölött áll, csak a bónusznyereményt kapja meg.

A második példában viszont a két if teljesen független egymástól. Mindkettő lefut, és mindkettő igaz lesz. Itt tehát két nyereményt kap az illető. Az első változatban egy nyeremény jár, a másodikban kettő. Szánj rá egy percet, és győződj meg róla, hogy ezt tényleg érted.

Az is érdekes, hogy a játék felépítésétől függően bármelyik lehet a helyes megoldás. Lehet, hogy a versenyző a rendes nyereményt és a bónuszt is megkapja, de az is lehet, hogy egyszerűen a bónusznyereményre váltják át. Egyik kód sem jó vagy rossz önmagában, csak más-más helyzetben hasznosak. Neked viszont tudnod kell, melyiket akarod éppen használni.
