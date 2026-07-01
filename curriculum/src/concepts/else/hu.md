---
title: "Else"
description: "Egy `else` ág hozzáadása az `if` után, hogy egy másik kódblokk fusson le, amikor a feltétel hamisnak bizonyul."
---

Az elágazással (if statement) feltételeket ellenőrizhetsz, és a kódot csak akkor futtathatod le, ha valami igaz. Most pedig jöjjön az `if` bűntársa, az `else`.

Egy `if`-nél Jiki lefuttatja a kódblokkot, ha a feltétel igaz, és kihagyja, ha hamis. De mi van akkor, ha azt szeretnéd, hogy Jiki az egyik dolgot csinálja, amikor a feltétel igaz, és egy másikat, amikor hamis? Pontosan erre való az `else`. Az `if` záró kapcsos zárójele (`}`) után tehetünk egy `else` ágat, és Jiki azt akkor futtatja le, ha az `if` feltétele hamis. Visszatérve a klubos kidobóhoz: most már ki is nyithatjuk az ajtót, vagy el is küldhetjük az illetőt, ami valószínűleg jobb annál, mint hogy teljesen figyelmen kívül hagyjuk, ahogy eddig. Gondolj rá úgy, mint egy útelágazásra. Jiki ideér, megnézi a feltételt, és aztán mehet az egyik irányba, ha igaz, vagy a másikba, ha hamis. De sosem megy mindkét felé.

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
  alt="Útelágazás a klub ajtajánál: nyisd ki az ajtót, ha a feltétel igaz, és küldd el az illetőt, ha hamis"
  width="500"
  height="332"
/>

De mi van, ha kettőnél több lehetőséged van? Képzeld el, hogy a kidobónk jegyeket árul. Tizenhárom év alatt gyerekjegy jár. Tizenhárom és húsz között tinijegy. Húsz évtől felfelé pedig felnőttjegy. Vagyis most három különböző kimenetel van. Ehhez az `else` után betehetünk még egy `if`-et. Így azt mondhatjuk: „Ha ez igaz, akkor csináld ezt. Ha pedig ez az állítás igaz, csináld ezt. Különben csináld ezt a harmadik dolgot." Ebben a példában Jiki meglátja az `if`-et, és ellenőrzi az első feltételt. Tizenhat kisebb, mint tizenhárom? Nem. Ezért továbblép az `else if`-re. Tizenhat kisebb, mint húsz? Igen, ez igaz. Így lefuttatja azt a blokkot, és tinijegyet ad. Ezzel viszont készen is van. Semmi mást nem ellenőriz. Az utolsó `else`-re rá se néz. Amint Jiki talál egy igaz feltételt, lefuttatja annak a blokkját, és mindent kihagy, ami alatta van.

Ezt a legfontosabb megérteni: mindig csak egyetlen blokk fut le. Jiki végighalad a láncon, megtalálja az első igaz feltételt, lefuttatja annak a blokkját, és továbblép.

Van még egy dolog, amit érdemes alaposan megérteni, mert sokakat megtréfál. Van egy apró, de nagyon fontos különbség aközött, hogy két külön `if`-et írsz, vagy hogy `else if`-et használsz. Képzeld el, hogy egy programot írunk, ami valakinek a pontszámától függően vagy alap-, vagy bónuszdíjat ad. Nézd meg ezt a két lehetőséget. Az egyik `else if`-et használ, a másik két `else`-t. Mi történik másképp?

Az első esetben, az `else if`-fel, megnézzük a magas pontszámot, kiadjuk a díjat, és utána az `else` nem fut le. Így az illető, ha száznál több pontja van, csak a bónuszdíjat kapja meg.

A második példában viszont a két `if` teljesen független egymástól. Mindkettő lefut, és mindkettő igaz lesz. Így az illető itt két díjat kap. Az elsőben egy díj, a másodikban kettő. Szánj rá egy percet, hogy ezt tényleg megértsd.

Érdemes azt is észben tartani, hogy a játék felépítésétől függően bármelyik lehet a helyes. Talán a versenyző kap egy sima díjat és egy bónuszt is, vagy talán csak feljebb lép a bónuszdíjra. Egyik kód sem jó vagy rossz önmagában. Csak más-más helyzetben hasznosak. De tudnod kell, melyiket akarod használni.
