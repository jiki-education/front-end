---
title: "Boje"
description: "Dva načina da odrediš bilo koju boju koju poželiš. RGB meša crvenu, zelenu i plavu svetlost. HSL koristi nijansu, zasićenost i osvetljenost."
en_md5: a0eea0481b975e45f75774d83966a4a7
---

Ako ikada budeš radio nešto vizuelno sa kodom (a čak i ako želiš da budeš data scientist i misliš da je sve to crtanje pomalo dosadno, komuniciranje podataka kroz vizuelne prikaze je ključna veština), postoje dva različita načina za izražavanje boja. Već si koristio boje njihovim imenima, poput red ili yellow, kao poslednji ulaz u svojim funkcijama za crtanje, i to je bio zgodan način da brzo koristiš boje, ali je prilično ograničavajuće. Samo mali broj imenovanih boja je na raspolaganju. Zato ćemo sada pogledati dva načina da izraziš bilo koju boju koju poželiš, a ta dva se zovu RGB i HSL.

RGB nam omogućava da o bojama razmišljamo kao o mešavini crvene, zelene i plave. To je ono što RGB znači: crvena (engl. _red (R)_), zelena (engl. _green (G)_), plava (engl. _blue (B)_). Ako se sećaš mešanja boja u školi, to je slična ideja, samo što ovde mešamo svetlost, a ne farbu.

U mnogim vežbama imaćeš funkciju pod nazivom `rgb`, koja uzima tri broja kao ulaze – jedan za crvenu, jedan za zelenu, jedan za plavu – i vraća boju.

Brojevi koje možeš da koristiš kao ulaze idu od nule do `255`. Nula znači „ne želim ni malo te boje“, a `255` znači „dodaj što je više moguće te boje“. Dakle, ako upotrebimo funkciju `rgb` sa ulazima `255`, nula i nula, time kažemo: hoćemo svu crvenu. Zapamti da je `255` najveći broj koji možeš da staviš tamo. Ali ne želimo ni malo zelene ni plave, tako da su oni nula. Kao rezultat dobijamo crvenu, i tu crvenu možemo da sačuvamo u promenljivu i zatim je koristimo u funkciji `circle`, baš kao što smo već radili sa imenovanim stringovima. A šta ako upotrebimo funkciju `rgb` sa nulom, `255`, nulom? Sada kažemo: bez crvene, sva zelena, bez plave. Tako dobijamo zeleni krug. A šta ako želimo žutu? Žuta je mešavina crvene i zelene. Dakle, možemo reći: daj mi svu crvenu, svu zelenu i bez plave, i to će nam dati žutu. I možemo da koristimo manje brojeve. Ako želimo malo crvene, bez zelene i puno plave, dobićemo ljubičastu. A mnogo crvene, malo zelene i još malo više plave daje nam roze. To je RGB. Mešamo crvenu, zelenu i plavu da bismo dobili različite kombinacije.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/rgb-intro.webp"
  alt="Tri preklapajuća kruga crvene, zelene i plave svetlosti koji mešanjem daju žutu, magenta, cijan i belu"
  width="500"
  height="390"
/>

```javascript
let red = rgb(255, 0, 0)
let green = rgb(0, 255, 0)
let yellow = rgb(255, 255, 0)
let pink = rgb(230, 50, 170)
```

Sada hajde da pogledamo HSL, koji nam daje potpuno drugačiji način razmišljanja o bojama. HSL znači nijansa (engl. _hue (H)_), zasićenost (engl. _saturation (S)_) i osvetljenost (engl. _lightness (L)_). Slično kao kod RGB-a, postoji funkcija pod nazivom `hsl` koja uzima tri broja – jedan za nijansu, jedan za zasićenost i jedan za osvetljenost – i vraća boju. Hajde da razložimo šta te tri reči znače.

Nijansa je nijansa (engl. _shade_) boje koju želiš, i ide od nule do 360. Možda zamisli dugu. Ovako ja o tome razmišljam. Na levoj strani imamo crvenu, a zatim narandžastu, žutu, zelenu, plavu, ljubičastu, i zapravo se vratimo sve nazad do crvene. Ako kažeš nula, počinješ s leve strane, i to je crvena. Ako kažeš `120`, tražiš zelenu. `230` je plava. Možeš ovo da zamisliš i kao krug boja (engl. _color wheel_), što 360 zapravo i jeste. To je broj stepeni u krugu. Ja uvek samo potražim brojeve koji mi trebaju, tako da ne brini previše da bi ovo morao da zapamtiš, ali je lepo znati šta se dešava. Dakle, to je nijansa, odnosno ton.

Zatim imamo zasićenost, koja govori koliko je boja živa. Ide od nule do 100. Na nuli dobiješ samo sivu. Uopšte nema boje, nikakvog tona. Na 100 dobiješ punu, živu, vibrantnu boju.

A onda imamo osvetljenost. Osvetljenost je koliko je boja svetla, i takođe ide od nule do 100. Na nuli dobiješ crnu. Bez obzira na to koju nijansu si odabrao, dobiješ crnu. U njoj nema svetlosti. Na 100 dobiješ belu. Bez obzira na sve ostalo, puna je svetlosti, pa je bela. 50 je tačno u sredini, normalna boja. Tako da ovo možeš da zamisliš kao klizač (engl. _slider_) za podešavanje svetline – da boju učiniš svetlijom ili tamnijom.

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/hsl-intro.webp"
  alt="Duga i krug boja koji prikazuju nijansu koja ide od 0 (crvena) do 120 (zelena) do 240 (plava)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/saturation-slider.webp"
  alt="Klizač zasićenosti od 0 (siva) preko 50 do 100 (živa magenta)"
  width="500"
  height="398"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/colors/lightness-slider.webp"
  alt="Klizač osvetljenosti od 0 (crna) preko 50 (puna boja) do 100 (bela)"
  width="500"
  height="398"
/>

Dakle, ako želimo normalan crveni krug, koji bismo u RGB-u zapisali kao 255, 0, 0 – sva crvena, bez zelene, bez plave – ovde bismo koristili 0, 100, 50. Nula za crvenu nijansu, 100 za zasićenost, puna boja, i 50 za osvetljenost, što je normalan nivo osvetljenosti. Ako želimo da napravimo zeleni krug, jednostavno možemo da promenimo tu nijansu na `120`. Ako želimo tamniju zelenu, možemo da smanjimo osvetljenost na `25`.

Ako želimo zagasitiju zelenu, možemo da oduzmemo malo boje, malo zasićenosti, recimo da je spustimo na `30`.

Ako želiš jarko, žarko roze, nijansa od oko 300 je roze, a zatim povećamo zasićenost na 100 da bude stvarno živo, i pojačamo i osvetljenost, takođe, na otprilike 60.

```javascript
let red = hsl(0, 100, 50)
let green = hsl(120, 100, 50)
let darkGreen = hsl(120, 100, 25)
let dullGreen = hsl(120, 30, 50)
let hotPink = hsl(300, 100, 60)
```

Dakle, imamo dva različita načina za izražavanje boje, i korisni su u različitim situacijama. RGB je odličan kada želiš da podešavaš jednu konkretnu komponentu – koliko crvene, koliko zelene, koliko plave. HSL je odličan kada želiš da prolaziš kroz boje. Ako želiš dugu, samo nastavi da povećavaš nijansu.
