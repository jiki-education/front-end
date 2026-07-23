---
title: "Változók létrehozása és használata"
description: "Dobozok Jiki polcain: egy-egy értéket őriznek felcímkézve, hogy később bármikor elővehesd őket a kódodban."
en_md5: cc99d0320435124c96d2fed07dc28074
---

Az információ tárolására a változók (_variables_ angolul) szolgálnak. Programozás közben gyakran el kell tennünk egy számot vagy egy stringet későbbre, és pontosan erre valók a változók. Nézzük hát egy kicsit távolabbról Jiki raktárát! Látni fogod, hogy van benne egy másik polcsor is. Az elsőt már ismerjük: azon sorakoznak a függvények, ezek a kis gépek, mint a `move` vagy a `rectangle`. Ezen a második polcsoron viszont gépek helyett rengeteg dobozt látsz, és ezeket a dobozokat hívjuk változóknak. Jikinek bármit odaadhatsz, hogy tegye el egy ilyen dobozba, később pedig megkérheted, hogy vegye elő újra. Minden doboznak van neve, pontosan úgy, ahogy a függvényeknek is, és minden dobozban pontosan egy dolog van. Egyelőre egy szám vagy egy string, de a kurzus későbbi részében azt is megnézzük, hogyan tárolhatunk bennük összetettebb dolgokat.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Két polcsor Jiki raktárában: az egyiken függvények felirat alatt gépek, a másikon változók felirat alatt dobozok"
  width="500"
  height="173"
/>

Na de hogyan mondjuk meg Jikinek, hogy készítsen egy dobozt, és tegyen bele valamit? A `let` kulcsszóval. A `let` kulcsszó azt jelzi Jikinek, hogy új dobozt kell készítenie. Képzeld el, ahogy kibontja a kartondobozt a csomagolásából, összeállítja, majd megnézi, mi áll a `let` szó után: ez lesz a címke, amit a dobozra tesz, jelen esetben a `name` (név). Fogja hát a tollát, és ráírja a címkére, hogy `name`. Ezután megnézi, mi áll az egyenlőségjel (_equal sign_ angolul) után. Ez most az én nevem, a `"Jeremy"`, és mivel a `"Jeremy"` egy string, Jiki fog egy papírlapot, és ráírja, hogy `"Jeremy"`. Ez ugyanolyan string, mint a színek, amikkel eddig dolgoztál. A papírlapot pedig beleteszi a dobozba.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki egy papírlapot tart a kezében, rajta a Jeremy string, készen arra, hogy a dobozba tegye"
  width="373"
  height="400"
/>

Megkértük tehát, hogy készítsen egy dobozt, címkézze fel, és tegyen bele valamit, ő pedig felteszi a dobozt a polcra. A programod bármelyik későbbi pontján Jiki le tudja venni a dobozt a polcról, és megnézi, mi van benne. Kezdd el felépíteni magadban ezt a képet! Én ősidők óta programozok, és kódírás közben még ma is azt képzelem el, hogy beleteszek valamit egy dobozba, amit később majd kiveszek. Amikor meglátod a `let` kulcsszót, tényleg gondolj arra: „Rendben, ez azt jelenti, hogy új dobozt készítek."

Néhány szó a változók nevéről, vagyis a dobozok címkéiről. Ezekre van pár szabályunk. Először is, a változónevekben nem lehet szóköz. Ha egy doboz címkéjéhez több szót szeretnél használni, a szavakat egyszerűen egymáshoz toljuk, és minden szó első betűjét nagybetűre cseréljük. Ezt hívjuk camel case-nek. Képzeld el, ahogy a teve púpjai minden új szó első betűjét nagybetűvé tolják fel. Ha tehát a my name címkét szeretnéd, két külön szó helyett egyetlen szót írunk, nagy N-nel: `myName`.

Emellett minden változónévnek egyedinek kell lennie. Nem lehet két dobozod ugyanazzal a címkével, és egy változó nem kaphatja ugyanazt a nevet, mint egy függvény. Ha ez mégis megtörténik, Jiki összezavarodik, és hibaüzenetet ad.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki értetlenül néz két dobozra, amelyeken ugyanaz a name címke szerepel"
  width="485"
  height="400"
/>

Nézzük meg, hol jöhet jól egy változó. Tegyük fel, hogy egy napot rajzolunk az égre. Tudjuk, hogy használhatjuk a `circle` (kör) függvényt, és négy bemenetet adhatunk neki: left, top, `radius` (sugár) és `color` (szín). Ahogy azonban egyre több mindent rajzolunk, és ezek a számok szétszórva hevernek a kódban, egyre nehezebb átlátni és követni őket. Ehelyett létrehozhatunk egy-egy változót a left, a top, a `radius` és a `color` értékének, és később ezekre a változókra hivatkozunk. A végcélunk az, hogy a `circle` függvénynek szép, olvasható dobozneveket adhassunk meg, és amikor Jiki meglátja ezeket a neveket, tudja, hogy le kell vennie a dobozokat a polcról, és azt kell használnia, ami bennük van.

Hozzunk hát létre néhány változót. Kezdjük a nap bal oldali pozíciójával. A `let` kulcsszóval szólunk Jikinek, hogy készítsen egy új, `leftPosition` nevű dobozt. Figyeld meg itt is a camel case-t a nagy P-vel. Azt is megmondjuk Jikinek, milyen szám kerüljön a dobozba. Ő felteszi a polcra, majd ugyanígy elkészíti a `topPosition`, a `radius` és a `color` dobozát is.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Felcímkézett dobozok a változók polcain, mindegyikben egy-egy érték, amit Jiki később elővehet"
  width="500"
  height="378"
/>

A kódunkban bármikor hivatkozhatunk ezekre a változókra, Jiki pedig kiveszi az értékeket (_values_ angolul), és belerakja őket egy gépbe. A változók másik nagy előnye, hogy ha bármikor a nappal azonos pozícióba szeretnénk rajzolni valamit, egyszerűen újra használhatjuk ugyanazt a `leftPosition` és `topPosition` változót. Vegyünk egy másik példát. Képzeld el, hogy falat építesz 30 téglából, és azt szeretnéd, hogy minden tégla ugyanolyan széles és ugyanolyan magas legyen. Sokkal jobb, ha a kódod elején létrehozol egy-egy változót a szélességnek és a magasságnak, és a továbbiakban ezekre hivatkozol. Ha ugyanis később módosítani akarod a szélességet vagy a magasságot, elég egyetlen helyen átírnod, és minden más automatikusan frissül.
