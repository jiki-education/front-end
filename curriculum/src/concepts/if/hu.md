---
title: "Elágazások"
description: "Az `if` kulcsszó használata, hogy egy kódblokk csak akkor fusson le, ha egy feltétel igaz. Olyan, mint amikor a kidobó eldönti, kit enged be."
en_md5: 44c0308ae479c0b30fb4b8cf06980071
---

Van egy kulcsszó, amivel megmondhatjuk Jikinek, hogy csak bizonyos helyzetekben csináljon valamit. Képzeld el, hogy egy bár bejáratát őrző kódot írsz, mondjuk te vagy a kidobó, és Jiki csak akkor nyithatja ki az ajtót, ha valaki megfelelően van felöltözve. Vagy éppen te intheted le a kockás zászlóval a versenyt a célban, de Jikinek tudnia kell, hogy ezt csak az utolsó körben szabad megtennie. Az ilyen helyzetekben az `if` kulcsszót fogjuk használni.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki kidobóként eldönti, hogy beengedje-e az embereket a szórakozóhelyre"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki készen áll, hogy a verseny végén leintse a kockás zászlót"
  width="266"
  height="400"
/>

Az `if` kulcsszót nagyon hasonlóan használjuk, mint a `repeat`-et. A zárójelek közé írunk valamit: ez lesz a feltétel (_condition_ angolul), amit ellenőrzünk. A kapcsos zárójelek közé pedig egy kódblokk kerül, amit csak akkor futtatunk le, ha ez a feltétel igaz.

```javascript
if (condition) {
}
```

Na de hogy néznek ki ezek a feltételek? Általában valamilyen összehasonlítások (_comparisons_ angolul). Két számot vagy két stringet hasonlítunk össze, és megnézzük, hogy az eredmény igaz vagy hamis.

Gondolj ezekre úgy, mint állításokra (_statements_ angolul), amiket hangosan is kimondhatsz. Három kisebb, mint öt. Ez igaz. Hét kisebb, mint kettő. Ez hamis.

Ezeket az összehasonlításokat jelekkel írjuk le. Valószínűleg ismered már őket matekból. Van kisebb, nagyobb, kisebb vagy egyenlő, nagyobb vagy egyenlő, és van még egy, ami azt ellenőrzi, hogy két dolog ugyanaz-e, vagyis egyenlő-e. Ez viszont kicsit másképp működik, mint amit megszoktál, mert három egyenlőségjelet írunk egymás után, ha azt vizsgáljuk, hogy két dolog ugyanaz vagy különböző.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Összehasonlító operátorok táblázata példákkal: kisebb, nagyobb, kisebb vagy egyenlő, nagyobb vagy egyenlő, egyenlő és nem egyenlő"
  width="449"
  height="400"
/>

Így nem keverjük össze azzal, amikor változót hozunk létre vagy frissítünk, ilyenkor ugyanis egyetlen egyenlőségjel jelenti azt, hogy „ezt tedd a dobozba". Csak azt jegyezd meg, hogy összehasonlításhoz három egyenlőségjel kell.

Stringeket is összehasonlíthatsz. A `"hello"` egyenlő a `"hello"`-val: ez igaz, a két string ugyanaz. De itt légy óvatos, mert Jiki a két papírlapon lévő stringek minden egyes karakterét (_character_ angolul) összehasonlítja. A nagy H-s `"Hello"` nem ugyanaz, mint a kis h-s `"hello"`: két különböző string. Az összehasonlításuk ezért hamis lenne, mert a nagy H és a kis h különböző karakterek.

Ja, és mellesleg: az igaz és a hamis értékeket _Boolean_-nek (logikai érték) hívják. Ez is egy technikásan hangzó szó, pedig nagyon egyszerű: csak egy hivatalos elnevezés arra, hogy valami vagy igaz, vagy hamis. Szóval ha azt hallod tőlem vagy mástól, hogy Boolean, az csak annyit jelent: igaz vagy hamis. Nézzük meg mindezt működés közben. Képzeld el, hogy azt a robotkidobót építjük egy klubnak, és azt mondjuk, hogy a kidobó csak akkor nyithatja ki az ajtót, ha az illető legalább 21 éves. Van egy `askAge` (kérdezd meg az életkort) függvényünk, amivel megkérdezhetjük valakinek az életkorát, és az eredményét egy `age` (életkor) nevű változóba mentjük. Utána mondhatjuk azt, hogy ha ez az `age` nagyobb, mint 20, kinyitjuk az ajtót. Ha tehát az `askAge` `30`-at ad vissza, kinyitjuk, ha pedig `12`-t, akkor nem.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki kinyitja az ajtót valakinek, aki elég idős, és nem engedi be azt, aki túl fiatal"
  width="410"
  height="400"
/>
