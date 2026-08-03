---
title: "For-loopar"
description: "En loop med tre delar (en initialisering, ett villkor och en ökning) som ger dig full kontroll över iterationen."
en_md5: e96f2e5a4106a88cfbca449c93a26108
---

Du kanske minns att repeat-loopen egentligen inte finns i JavaScript. Den är bara något vi lagt till för att göra livet lite enklare för dig medan vi kommer igång.

Så vad använder vi i stället? Jo, vi använder en vanlig `for`-loop, och den ser ut så här.

```javascript
for (let i = 0; i < 5; i++) {
  // ...
}
```

Du förstår säkert varför den kunde kännas lite skrämmande allra första dagen.

Men nu har du all kunskap du behöver för att bli bekväm med den. Så nu bryter vi ner den.

En for-loop har tre delar: en initialisering (_initializer_ på engelska), ett villkor och en ökning (_increment_ på engelska).

Initialiseringen, den här `let i = 0`-biten, körs i början av hela loopen. Den körs bara en gång, och här skapar den en låda som heter `i` med värdet noll. `i` är bara en bokstav som används för att hålla koll på ett värde medan vi loopar, och traditionellt är det `i` eller `x` som används till det.

Nästa del, villkoret, körs varje gång före varje iteration av loopen.

Om villkoret är sant kör vi loopen igen.

Om det inte är det kör vi den inte.

Och sist kommer ökningen, `i++`.

`i++` betyder helt enkelt samma sak som `i = i + 1`. Det är bara en förkortning, ett sätt att öka `i` med ett varje gång.

Så i det här exemplet sätter vi `i` till noll. Vi kollar om `i` är mindre än två, vilket det är, och då kör vi loopen.

Och i slutet ökar vi `i` med ett, så `i` blir ett. Noll plus ett är ett.

Sedan kör vi igen. Vi kollar om ett är mindre än två.

Det är det, så vi kör loopen. Och i slutet ökar vi `i` igen. Nu är det två, ett plus ett är två.

```javascript
i = 0
i < 2 // sant - kör loopen
...   // Gör iterationen
i = i + 1 // 1

i < 2 // sant - kör loopen
...   // Gör iterationen
i = i + 1 // 2

i < 2 // falskt - avsluta loopen
```

Och så går vi in en tredje gång. Den här gången kollar vi om två är mindre än två, och det är det inte, så vi kör inte loopen. Faktum är att vi är klara med loopen nu. Vi går bara vidare till koden nedanför. Så vi körde loopen två gånger, och det är bra att känna till: så länge vi börjar på noll och har ett villkor `i < n`, är talet `n` antalet gånger loopen kommer att köras.

Så det här är samma sak som att säga repeat två.

Det är alltså inte svårt, men det är mycket krångligare än att bara skriva repeat två. Fördelen med en for-loop är att du kan göra vad som helst i de tre delarna. Du kan börja på ett annat tal, räkna upp med mer än ett i taget, räkna nedåt, eller använda ett villkor som beror på något annat än en enkel räknare. Den flexibiliteten är det som gör for-loopar till arbetshästen i JavaScript.
