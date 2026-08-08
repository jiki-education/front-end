---
title: "Konverzija tipova"
description: "Pretvaranje vrednosti jednog tipa u drugi, kao što je pretvaranje stringa cifara u broj pomoću `Number()`, ili broja u string pomoću `String()`."
en_md5: 8d85e3d274a6cdfdb74bd0488b685f18
---

Svaka vrednost u našim programima ima svoj tip. `"7"` je string, a `7` je broj. Na prvi pogled skoro da izgledaju isto, ali Jiki ih tretira sasvim različito. Ne možeš da sabereš string `"7"` i broj `3` i očekuješ da dobiješ `10`, jer je jedno komad teksta, a drugo je količina.

Ovo se zove konverzija tipova (engl. _type conversion_), a postoje dve konverzije koje ćeš stalno koristiti.

### Pretvaranje stringa u broj

Kada čitaš karaktere iz stringa, svaki karakter je i sam string, čak i kada izgleda kao cifra. Pre nego što sa njim možeš da obaviš bilo kakvu aritmetiku, moraš da ga pretvoriš u pravi broj. To radimo pomoću `Number()`.

```javascript
Number("7")
// 7

Number("42")
// 42
```

Kada dobiješ pravi broj, možeš da ga sabiraš, množiš i sve ostalo.

```javascript
let digit = Number("7")
let doubled = digit * 2
// 14
```

Ako `Number()`-u proslediš nešto što nije ispravan broj, kao na primer `Number("mačka")`, nećeš dobiti nikakav broj nazad, pa je vredno postarati se da mu daješ samo stringove koji zaista jesu cifre.

### Pretvaranje broja u string

Obrnuti smer je jednako koristan. Ponekad imaš broj i želiš da ga tretiraš kao tekst, možda da bi ga spojio s drugim stringom ili da pogledaš njegove pojedinačne cifre. To radimo pomoću `String()`, koji je kao ogledalo `Number()`-a.

```javascript
String(42)
// "42"

let count = 7
String(count)
// "7"
```

Sada kada je to string, možeš da koristiš sve uobičajene alate za stringove na njemu, kao što je čitanje karakter po karakter ili provera njegove dužine.
