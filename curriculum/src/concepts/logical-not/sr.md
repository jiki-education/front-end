---
title: "Operator `not`"
description: "Korišćenje `!` za okretanje boolean vrednosti: tačno postaje netačno, a netačno postaje tačno, korisno za prebacivanje ili invertovanje provera."
en_md5: 842c4a4e9cb1fd11c4318a1508296e27
---

Do sada, kada smo upoređivali stvari da vidimo da li su jednake, koristili smo tri znaka jednakosti. Međutim, ponekad želimo da proverimo da li stvari nisu jednake, i za to koristimo uzvičnik praćen sa dva znaka jednakosti. I generalno, u programiranju, uzvičnik ili bang, kako to zovu naši američki prijatelji, znači ne. Zamisli da radiš u prodavnici, i uprava je donela odluku da niko ne može ući u disko odeći.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/shop-bouncer.webp"
  alt="Izbačivač na vratima prodavnice proverava odeću ljudi u redu"
  width="451"
  height="400"
/>

Možemo reći: „Ako odeća nije disko, otvori vrata.“ If naredba radi potpuno isto.

```javascript
if (outfit !== "disco") {
  openDoor()
}
```

Samo što uslov vraća tačno ako su stvari različite, a vraća netačno ako su iste. Dakle, isto bismo mogli napisati tako što bismo rekli: „Ako je odeća disko, ne radi ništa. U suprotnom, otvori vrata.“ Ali generalno, lakše je i čistije koristiti `not` operator da zaista znaš i kažeš ono što misliš.

Još jedna stvar u vezi sa ovim. Ponekad ćeš imati promenljivu koja je tačna, i želiš da je okreneš na netačno, ili ćeš imati nešto što je netačno i želiš da okreneš na tačno, i to možemo koristiti za praćenje stanja. Zamisli da imamo nešto što se odbija s leva na desno, i imamo promenljivu pod imenom `movingRight` (pomeranje udesno), koja je tačna kada treba da se krećeš udesno. Ali kada udariš u desnu ivicu, želiš da ga prebaciš (engl. _toggle_) na netačno.

<img
  class="concept-image"
  src="/static/images/concept-assets/logical-not/pong-court.webp"
  alt="Teren u stilu Ponga sa reketima i lopticom koja se odbija s jedne na drugu stranu, što prikazuje prebacivanje promenljive movingRight"
  width="500"
  height="352"
/>

To bismo mogli uraditi tako što bismo rekli: „Ako je `movingRight` jednako tačno, `movingRight` je netačno. U suprotnom, `movingRight` je tačno.“ To je način da se promenljiva prebaci. Dakle, Jiki će pogledati `movingRight` da vidi da li je tačno ili netačno, a zatim će izračunati suprotno i vratiti tu vrednost u kutiju.

```javascript
if (movingRight === true) {
  movingRight = false
} else {
  movingRight = true
}
```

Ali postoji uredniji način da se to uradi, a to je da se koristi isti uzvičnik ili bang:

```javascript
movingRight = !movingRight
```

I to ga okrene. `!movingRight` znači suprotno od onoga što je bilo prethodno.

Dakle, ako je `movingRight` bilo tačno, sada je netačno. Ako je bilo netačno, sada je tačno. Jiki uzima ono što je trenutno u kutiji, i taj bang mu govori da nađe suprotno. Dakle, suprotno od tačno je netačno. Suprotno od netačno je tačno, a zatim on to vraća natrag u kutiju. Ovo je potpuno isto kao i ona duža if/else naredba, samo je mnogo urednije i sažetije napisati.
