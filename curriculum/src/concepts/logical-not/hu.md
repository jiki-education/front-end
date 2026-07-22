---
title: "A `not` operátor"
description: "A `!` segítségével átfordíthatsz egy Boolean értéket (logikai értéket): az igazból hamis lesz, a hamisból igaz. Hasznos átkapcsoláshoz vagy egy ellenőrzés megfordításához."
en_md5: 302c1bfdd7bb651d8695c4e57218e1f5
---

Eddig, amikor azt vizsgáltuk, hogy két dolog egyenlő-e, három egyenlőségjelet használtunk. Néha viszont azt szeretnénk ellenőrizni, hogy két dolog nem egyenlő, és ehhez egy felkiáltójelet írunk, utána pedig két egyenlőségjelet. A programozásban a felkiáltójel (vagy „bang", ahogy szerintem amerikai barátaink hívják) általában azt jelenti: nem. Képzeld el, hogy egy boltban dolgozol, és a vezetőség úgy döntött, hogy diszkós szerelésben senki nem jöhet be.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="Egy kidobó a bolt ajtajában, aki a sorban álló emberek öltözékét ellenőrzi"
  width="451"
  height="400"
/>

Mondhatjuk azt: „Ha a szerelés nem diszkós, nyisd ki az ajtót." Az elágazás (if statement) pontosan ugyanúgy működik.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

Csak annyi a különbség, hogy a feltétel akkor ad vissza igazat, ha a két dolog különbözik, és akkor hamisat, ha megegyeznek. Ugyanezt úgy is leírhatnánk, hogy „Ha a szerelés diszkós, ne csinálj semmit. Különben nyisd ki az ajtót." Általában viszont egyszerűbb és tisztább a `not` operátort használni, mert így pontosan azt mondod ki, amire gondolsz.

Még egy dolog kapcsolódik ide. Néha lesz egy változód (variable), ami igaz, és át akarod fordítani hamisra, vagy valamid, ami hamis, és igazra akarod fordítani. Ezzel nyomon tudunk követni dolgokat. Képzeld el, hogy valami balról jobbra pattog, és van egy movingRight nevű változónk, ami akkor igaz, amikor jobbra kell mozogni. Amikor viszont eléred a jobb szélt, át akarod kapcsolni hamisra.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="Pong-stílusú pálya ütőkkel és egy ide-oda pattogó labdával, ami a movingRight változó átkapcsolását szemlélteti"
  width="500"
  height="352"
/>

Megtehetnénk ezt úgy, hogy azt mondjuk: „Ha a movingRight igaz, legyen a movingRight hamis. Különben legyen igaz." Ez az egyik módja a változó átkapcsolásának. Jiki tehát megnézi a movingRight értékét, hogy igaz-e vagy hamis, kitalálja az ellenkezőjét, és azt teszi vissza a dobozba.

Van viszont ennél elegánsabb megoldás is: ugyanez a felkiáltójel, vagyis a „bang". Írhatjuk azt, hogy `movingRight = !movingRight`, és ez átfordítja. A `!movingRight` mindig az aktuális érték ellenkezőjét jelenti.

```javascript
movingRight = !movingRight
```

Ha tehát a movingRight igaz volt, most hamis lesz. Ha hamis volt, most igaz. Jiki kiveszi, ami éppen a dobozban van,

a bang pedig azt mondja neki, hogy keresse meg az ellenkezőjét. Az igaz ellenkezője a hamis, a hamis ellenkezője az igaz, és ezt teszi vissza a dobozba. Ez pontosan ugyanaz, mint a hosszabb if/else elágazás, csak sokkal rövidebb és elegánsabb leírni.
