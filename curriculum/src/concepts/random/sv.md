---
title: "Slumptal"
description: "Så använder du `Math.randomInt` med ett minsta och ett största värde för att få ett nytt tal varje gång funktionen körs."
en_md5: 5f41de1ca5327be4a86a69d801f1b6f9
---

I programmering vill vi ofta använda en funktion och få tillbaka ett nytt slumptal (_random number_ på engelska) varje gång.

Det är användbart på alla möjliga sätt och ställen, men särskilt inom kryptografi. Där gör vi ofta saker som att skapa koder som maskiner delar med varandra, och de koderna måste vara slumpmässiga så att de inte kan hackas.

Till din hjälp finns en funktion som heter `Math.randomInt` (`Math` betyder matematik och `randomInt` slumpmässigt heltal). Du ser kanske att det finns en punkt i mitten. När du får tillgång till fler funktioner kan vi ordna dem i olika grupper för att hålla ordning, och `Math`-delen (kort för matematik) är namnet på den grupp som den här funktionen tillhör. Den talar om för Jiki vilken del av hyllorna han ska leta på, i det här fallet `Math`-sektionen. Punkten betyder bara: gå till den här sektionen och hitta funktionen. Bry dig inte så mycket om det här just nu. Instruktionerna i övningarna talar alltid om vilka funktioner som finns och hur du använder dem. Det viktiga att förstå är att när Jiki använder den här funktionen får han ett nytt tal varje gång han kör den, med en begränsning. Funktionen tar emot två indata. Det första värdet är det minsta tal maskinen får returnera, och det andra är det största tal maskinen får returnera. Så om du använder funktionen `Math.randomInt` med `10` och `13` får du alltid tillbaka `10`, `11`, `12` eller `13`. Men du får ett annat tal varje gång.

<img
  class="concept-image"
  src="/static/images/concept-assets/random/jiki-shelves-math.webp"
  alt="Jiki klättrar på en stege upp till Math-sektionen på hyllorna i sitt lager"
  width="440"
  height="400"
/>

```javascript
Math.randomInt
```

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-two-inputs.webp"
  alt="Maskinen Math.randomInt med två inkast i form av trattar på ovansidan"
  width="500"
  height="378"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/random/function-10-13.webp"
  alt="Maskinen Math.randomInt med 10 och 13 i sina inkast, och den ger 10, 11, 12 eller 13"
  width="488"
  height="400"
/>

Nu ska vi tänka oss att du vill rita en cirkel på en slumpmässig position på canvasen. Då kan du använda `Math.randomInt` för att få olika värden för `left` och `top` varje gång, men med gränser på till exempel `10` och `90`, så att de aldrig hamnar utanför canvasen. Varje gång du kör den här koden ritas cirkeln på ett lite annat ställe.
