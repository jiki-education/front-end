---
title: "Loopa igenom strängar"
description: "Med en `for of`-loop går du igenom varje bokstav i en sträng och gör något med var och en i tur och ordning."
en_md5: 584ac0a187a9e5244b84f0fd417494f3
---

Du kan komma åt en enskild bokstav i en sträng med hakparenteser. Nu ska vi titta på hur du loopar igenom en sträng och plockar ut en bokstav i taget.

För att göra det behöver vi en ny sorts loop. Hittills har vi använt `repeat`-loopen, och nu ska vi använda något som kallas en `for of`-loop (den loopar igenom varje element i en samling, ett i taget). Det är två nya nyckelord, `for` och `of`.

Nyckelordet `for` kommer vi att stöta på på fler ställen framöver. Det kan stå för sig självt, eller paras ihop med `in` eller `of`. Just nu fokuserar vi på det sista av dem, `of`.

Så nu tar vi en titt på lite kod.

Vi börjar med att skapa en variabel som heter `name` (namn) och som innehåller strängen `"Jeremy"` (namnet Jeremy). Inget nytt så långt.

Sedan kommer själva loopraden. Där händer det en hel del, så vi går igenom den i lugn och ro.

```javascript
let name = "Jeremy"
for (let letter of name) {
  // ...
}
```

Först har vi nyckelordet `for`. Det talar om för Jiki att vi vill loopa. Då tittar han framåt, ser `of` och förstår att det är ”for of”-loopande vi är ute efter.

Det betyder att i stället för att använda en `repeat`-loop, där vi säger ”loopa 10 gånger”, säger vi ”loopa igenom alla bokstäver i strängen”. Det är vad ”for of” betyder.

Sedan har vi den här biten: `let letter` (bokstav). Det är precis samma sak som `let name` på raden ovanför. Vi skapar helt enkelt en variabel som heter `letter`.

Skillnaden är att vi inte uttryckligen säger vad som ska ligga i den. I stället ber vi Jiki att lägga varje bokstav i strängen i den, en i taget.

Så Jiki ser `for`, kollar att där står `of` och sätter igång. Han tittar på den första bokstaven i strängen, i det här fallet `"J"`, och lägger den i en ny låda som heter `letter`. Vi hade förresten kunnat kalla lådan vad som helst. Den måste inte heta `letter`. Vi har bara valt att kalla den `letter` här.

Sedan kör han koden mellan klammerparenteserna, och här kan du göra precis allt du kan göra någon annanstans i kod. Den enda skillnaden är att det här blocket körs en gång för varje bokstav i strängen, och att variabeln finns tillgänglig i det.

Varje gång Jiki når den avslutande klammerparentesen slänger han `letter`-lådan och skapar en ny med nästa bokstav i. Första gången slänger han alltså `"J"` och lägger ett `"e"` i lådan i stället. Sedan gör han samma sak med `"r"`, sedan `"e"`, sedan `"m"` och sedan `"y"`. Sex bokstäver, sex varv i loopen. Det tar en liten stund att vänja sig vid syntaxen, men själva idén är egentligen inte så svår.

<img
  class="concept-image"
  src="/static/images/concept-assets/string-iteration/jiki-letter-box-loop.webp"
  alt="Jiki slänger den gamla bokstavslådan och släpper ner nästa bokstav i en ny låda med etiketten letter, om och om igen för varje bokstav i strängen"
  width="500"
  height="168"
/>
