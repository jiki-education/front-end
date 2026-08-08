---
title: "Scenarier"
description: "Olika utgångslägen som en övning kör din kod mot, så att du måste få samma kod att fungera för dem alla."
en_md5: d5c4ee54eed8083e13f18bb7d256b86d
---

Varje övning kommer med olika scenarier, olika situationer som din kod behöver hantera.

Du ser dem som små knappar precis ovanför utdatan i varje övning. Varje knapp motsvarar ett scenario. Ditt jobb är att skriva kod som fungerar för alla, inte bara det första. Det tål att sägas igen: du skriver din kod en gång, men samma kod körs för varje scenario. Skillnaden är att varje scenario kan vara upplagt lite olika, eller att funktionerna du får kan returnera lite olika saker beroende på vilket scenario du är i.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/scenario-buttons.webp"
  alt="Raden med scenarioknappar precis ovanför en övnings utdata, inringade för att lyfta fram dem"
  width="500"
  height="318"
/>

Ta ett golfspel som exempel. Du kan behöva variera hur långt en boll rullar utifrån returvärdet (_return value_ på engelska) från en funktion som heter `getShotLength` (hämta slagets längd), som talar om hur långt golfspelaren har slagit bollen. Tänk dig att spelaren har fått svajpa på sin telefon för att visa hur långt slaget var.

<img
  class="concept-image"
  src="/static/images/concept-assets/scenarios/golf-game.webp"
  alt="En golfscen med en golfspelare, en boll och en flagga i hålet till höger"
  width="412"
  height="400"
/>

Resultatet kommer tillbaka till dig genom den här funktionen. I ett scenario kan du alltså använda funktionen `getShotLength`, och den returnerar `23`, en kort svajpning. I ett annat returnerar den `70`, en lång svajpning. I ett tredje returnerar den `45`. Din kod behöver rulla bollen rätt sträcka i varje scenario, med bara ett program, en enda uppsättning kod. Du behöver använda funktionen `getShotLength` för att se hur långt slaget gick och sedan rulla bollen dit.

```javascript
let distance = getShotLength()
```

Scenarier ser till att din kod faktiskt fungerar ordentligt. Det är ganska lätt att skriva kod som fungerar i en specifik situation. Det är mycket svårare, och mycket mer värdefullt, att skriva kod som fungerar i många olika situationer. När du löser övningar, börja med det första scenariot. Få det att fungera. Gå sedan vidare till nästa scenario och få det att fungera. När din kod slutar fungera i ett nytt scenario, fundera på vad som är annorlunda och hur koden behöver anpassas.
