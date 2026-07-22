---
title: "Else"
description: "Egy `else` ág hozzáadása az `if` után, hogy egy másik kódblokk fusson le, ha a feltétel hamisnak bizonyul."
en_md5: 4dd08e94d86dd11cd54793cf64008e3d
---

Az elágazások segítségével feltételeket ellenőrizhetsz, és csak akkor futtatsz le kódot, ha valami igaz. Most pedig ismerd meg az if cinkostársát, az `else`-t.

Egy elágazásnál (_if statement_ angolul) Jiki akkor futtatja le a kódblokkot, ha a feltétel igaz, ha pedig hamis, egyszerűen átugorja. De mi van akkor, ha azt szeretnéd, hogy Jiki az egyik dolgot csinálja, amikor a feltétel igaz, és egy másikat, amikor hamis? Pontosan erre való az else. Az if záró kapcsos zárójele után tehetünk egy else ágat (_else clause_ angolul), és Jiki akkor futtatja le, ha az if feltétele hamis. Ha visszatérünk a klubos kidobóemberes példához, most már választhatunk: kinyitjuk az ajtót, vagy elküldjük az illetőt. Ez valószínűleg jobb, mint eddig, amikor egyszerűen levegőnek néztük. Gondolj rá úgy, mint egy útelágazásra. Jiki odaér az elágazáshoz, ellenőrzi a feltételt, és ha igaz, az egyik irányba megy tovább, ha hamis, a másikba. Egyszerre mindkét irányba viszont sosem megy.

```javascript
if (age >= 21) {
  openDoor()
} else {
  turnAway()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/else/fork-in-the-road.webp"
  alt="Útelágazás a klub ajtajánál: ha a feltétel igaz, kinyílik az ajtó, ha hamis, elküldik az illetőt"
  width="500"
  height="332"
/>

De mi van, ha kettőnél több lehetőség van? Képzeld el, hogy a kidobóemberünk jegyeket árul. Tizenhárom év alatt gyerekjegyet kapsz. Tizenhárom és húsz között ifjúsági jegyet. Húsz évtől pedig felnőttjegyet. Így már három különböző kimenetel van. Ehhez az else után hozzáadhatunk egy újabb elágazást. Mondhatjuk azt, hogy: „Ha ez igaz, csináld ezt. Különben, ha ez igaz, csináld azt. Különben csináld ezt a harmadik dolgot." Ebben a példában Jiki meglátja az if-et, és ellenőrzi az első feltételt. Kisebb a tizenhat tizenháromnál? Nem. Így továbblép az else if-re. Kisebb a tizenhat húsznál? Igen, ez igaz. Lefuttatja tehát azt a blokkot, és kiad egy ifjúsági jegyet. Ezzel viszont végzett is. Semmi mást nem ellenőriz. A legvégső else-re rá se néz. Amint Jiki talál egy igaz feltételt, lefuttatja a hozzá tartozó blokkot, és minden alatta lévőt átugrik.

```javascript
if (age < 13) {
  childTicket()
} else if (age < 20) {
  teenTicket()
} else {
  adultTicket()
}
```

Ez a legfontosabb, amit meg kell értened: mindig csak egyetlen blokk fut le. Jiki végigmegy a láncon, megkeresi az első igaz feltételt, lefuttatja azt a blokkot, aztán továbbmegy.

Van még valami, amit fontos igazán megérteni, mert sokakat megzavar. Finom, de nagyon fontos különbség van aközött, hogy két külön elágazást írsz, vagy else if-et használsz. Képzeld el, hogy egy olyan programot készítünk, amely valakinek a pontszáma alapján vagy egy alapnyereményt, vagy egy bónusznyereményt ad. Nézd meg ezt a két lehetőséget. Az egyik else if-et használ, a másik két külön `if`-et. Mi fog másképp történni?

```javascript
if (score > 100) {
  bonusPrize()
} else if (score > 50) {
  basicPrize()
}
```

```javascript
if (score > 100) {
  bonusPrize()
}
if (score > 50) {
  basicPrize()
}
```

Az első esetben, az else if-fel, ellenőrizzük a magas pontszámot, odaadjuk a nyereményt, az else if-et pedig már nem futtatjuk le. Így aki száz pont felett teljesít, csak a bónusznyereményt kapja meg.

A második példában viszont a két if teljesen független egymástól. Mindkettő lefut, és mindkettő igaz lesz. Így itt az illető két nyereményt kap. Az első változatban egy nyeremény, a másodikban kettő. Szánj rá egy percet, hogy ezt tényleg megértsd.

Az is érdekes, hogy a játék felépítésétől függően bármelyik lehet a helyes megoldás. Lehet, hogy a versenyző egy sima és egy bónusznyereményt is kap, de az is lehet, hogy csak átminősítik a nyereményét bónuszra. Egyik kód sem jó vagy rossz önmagában, csak más-más helyzetben hasznosak. Neked viszont tudnod kell, melyiket akarod éppen használni.
