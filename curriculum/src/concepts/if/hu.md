---
title: "Elágazások (If Statements)"
description: "Az `if` kulcsszó használata, hogy egy kódblokk csak akkor fusson le, ha valamilyen feltétel igaz - mint egy kidobó, aki csak a megfelelő embereket engedi be."
---

Van egy kulcsszó (keyword), amivel megmondhatjuk Jikinek, hogy bizonyos helyzetekben csak bizonyos dolgokat csináljon. Képzeld el, hogy egy bár bejáratát őrző kódot írsz: te vagy a kidobó, és Jiki csak akkor nyithatja ki az ajtót, ha valaki megfelelően van felöltözve. Vagy egy verseny végén te lengeted meg a kockás zászlót, de Jikinek tudnia kell, hogy ezt csak az utolsó körben teheti meg. Az ilyen helyzetekben az `if` kulcsszót használjuk.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki kidobóként dönti el, hogy beengedje-e az embereket az éjszakai klubba"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki készen áll, hogy meglengesse a kockás zászlót egy verseny végén"
  width="266"
  height="400"
/>

Az `if` kulcsszót nagyon hasonlóan használjuk, mint a `repeat`-et. A zárójelek (`()`) közé beírunk valamennyi információt: ebben az esetben azt a feltételt, amit ellenőrzünk. A kapcsos zárójelek (`{}`) közé pedig egy kódblokk kerül, ami csak akkor fut le, ha ez a feltétel igaz.

```javascript
if (condition) {
}
```

Na de hogy néznek ki ezek a feltételek? Általában valamilyen összehasonlítás áll bennük. Fogunk két számot vagy két stringet, összehasonlítjuk őket, és megnézzük, hogy az eredmény igaz-e vagy hamis.

Gondolj ezekre úgy, mint kijelentésekre, amiket hangosan is kimondhatnál. Három kisebb, mint öt. Ez igaz. Hét kisebb, mint kettő. Ez hamis.

Ezeket az összehasonlításokat szimbólumokkal írjuk le, amiket a matekból valószínűleg már ismersz: kisebb mint, nagyobb mint, kisebb vagy egyenlő, nagyobb vagy egyenlő. És van még egy, ami azt ellenőrzi, hogy két dolog ugyanaz-e, vagyis egyenlők-e. Ez viszont kicsit másképp néz ki, mint amit megszoktál: annak eldöntésére, hogy két dolog egyenlő-e, három egyenlőségjelet írunk egymás után.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Az összehasonlító operátorok táblázata: kisebb mint, nagyobb mint, kisebb vagy egyenlő, nagyobb vagy egyenlő, egyenlő és nem egyenlő, példákkal"
  width="449"
  height="400"
/>

Így nem keverjük össze azzal, amikor egy változó (variable) értékét állítjuk be vagy frissítjük. Ott ugyanis egyetlen egyenlőségjelet használunk, ami azt jelenti: „tedd ezt a dobozba”. Mindebből azt jegyezd meg, hogy összehasonlításhoz három egyenlőségjel kell.

Stringeket is összehasonlíthatsz. A „hello” egyenlő a „hello”-val, tehát igaz: a két string ugyanaz. De itt légy óvatos: Jiki minden egyes karaktert összevet a két string között. A nagy H-s „hello” ezért nem ugyanaz, mint a kis h-s: ezek különböző stringek. Az összehasonlításuk hamis lesz, mert a nagy H és a kis h két különböző karakter.

Az igaz és a hamis egyébként egy közös néven fut: Booleannek hívják őket, ami magyarul logikai értéket jelent. Ez is egy ilyen száraz technikai szakkifejezés, pedig nagyon egyszerű a jelentése: valami vagy igaz, vagy hamis. Szóval ha azt hallod tőlem vagy mástól, hogy „Boolean”, csak az igazra vagy hamisra gondolj.

Lássuk működés közben. Képzeld el, hogy azt a robotkidobót építjük a klubhoz, és a szabály ez: a kidobó csak akkor nyithatja ki az ajtót, ha az illető legalább 21 éves. Az `askAge` függvényünkkel (function) megkérdezzük valakinek a korát, az eredményt pedig egy `age` nevű változóban tesszük el. Innen már egyszerű: ha a kor 21 vagy több, kinyitjuk az ajtót. Ha az `askAge` 30-at ad vissza, kinyílik; ha 12-t, zárva marad.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki kinyitja az ajtót annak, aki elég idős, és nem engedi be azt, aki túl fiatal"
  width="410"
  height="400"
/>
