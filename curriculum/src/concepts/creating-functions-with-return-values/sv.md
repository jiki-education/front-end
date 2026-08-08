---
title: "Ge dina funktioner returvärden"
description: "Så använder du nyckelordet `return` för att ge dina egna funktioner en rutschkana som skickar tillbaka ett värde till den som anropar dem."
en_md5: 51d31f709a7051c29b499a31ad68555e
---

Nu vet du hur du skapar funktioner både med och utan indata. Det finns en sista sak kvar att lära sig, och sedan är du expert på att bygga funktioner: hur du ger dina funktioner en rutschkana.

Du har redan använt massor av funktioner som returnerar saker. `isAlienAbove` (finns det en rymdvarelse ovanför) ger dig tillbaka sant eller falskt. `Math.randomInt(1, 10)` (`Math` betyder matematik och `randomInt` slumpmässigt heltal) ger dig tillbaka ett slumptal.

När Jiki använder de här funktionerna kommer något ut ur rutschkanan, som han sedan kan gå vidare och använda.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/output-chute.webp"
  alt="Jiki fångar upp ett värde när det kommer ut ur en maskins rutschkana"
  width="500"
  height="312"
/>

För att göra det här behöver vi ännu ett nytt nyckelord, och det är nyckelordet `return`.

Nyckelordet `return` säger åt mini-Jiki att knuffa ut något genom rutschkanan.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/return-keyword-push.webp"
  alt="Mini-Jiki inne i maskinen knuffar ut värdet 42 genom rutschkanan"
  width="500"
  height="335"
/>

Nu skapar vi en funktion, och vi döper den till `meaningOfLife` (meningen med livet). Den här funktionens jobb är att alltid returnera talet `42`. Den har ingen indata. Vi skriver den så här:

```javascript
function meaningOfLife() {
  return 42
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/meaning-of-life-42.webp"
  alt="Maskinen meaningOfLife skickar ut talet 42 genom sin rutschkana"
  width="500"
  height="323"
/>

Överallt där vi använder `meaningOfLife()` i koden får vi nu tillbaka talet `42`, och kan använda det precis som vilket annat värde som helst. Vi kan lägga det i en låda med `let`, skicka in det som indata till en annan funktion eller jämföra det i en `if`-sats.

Funktioner med returvärden kan också ta emot indata. Du skulle kunna skriva en funktion `ageBracket(age)` (åldersgrupp) som returnerar `"Sorry, too young"` när `age` är under 18, och `"Welcome"` annars. Den som anropar funktionen får tillbaka den sträng som funktionen returnerade.

```javascript
function ageBracket(age) {
  if (age >= 18) {
    return "Welcome"
  }
  return "Sorry, too young"
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-return-values/age-input.webp"
  alt="Ett åldersvärde släpps ner i maskinens inkast så att den kan bestämma vad den ska returnera"
  width="487"
  height="400"
/>

Det är så här programmering fungerar i grunden. Vi skapar massor av sådana här små byggstenar och sätter sedan ihop dem till program.
