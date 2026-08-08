---
title: "Break"
description: "Så använder du nyckelordet `break` i loopens kropp för att avsluta loopen direkt och gå vidare till koden som kommer efter den."
en_md5: 30148766de67ae467ab1a4852ad35895
---

Nyckelordet `break` kan du använda var som helst i kroppen på vilken loop som helst.

Delen mellan klammerparenteserna (`{}`), det är kroppen. Och när Jiki ser ett `break` hoppar han ur loopen direkt och går vidare till koden som står under loopen.

Säg att vi har ett krav som säger att loopen ska köras 50 gånger, men att vi vill stanna om spelaren har skjutit fem gånger. Då kan vi ha en `for`-loop högst upp som räknar upp mot 50.

Men mitt i loopen kan vi ha ett villkor som kollar om spelaren har skjutit fem gånger, och om så är fallet använder vi `break` (avbryt) för att stoppa loopen.

```javascript
for (let i = 0; i < 50; i++) {
  if (numShots >= 5) {
    break; // avbryt loopen
  }
}
```
