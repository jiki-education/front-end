---
title: "Uppdatera variabler"
description: "Ändra vad som finns i en variabel medan programmet kör, så att du kan hålla koll på positioner, antal, poäng och andra värden som förändras."
en_md5: f9b2fbb6bfd82a620b093e88951ff841
---

Hittills, när vi har skapat variabler, har vi lagt värden i lådor och tagit ut dem senare. Det har varit riktigt användbart: koden har blivit tydligare, och vi har sluppit en del av den huvudräkning vi annars hade fått göra. Men variablernas verkliga styrka ligger i att vi kan ändra vad som finns i en låda, vad som finns i variabeln, medan programmet kör. Så även om vi kör samma kodsnutt flera gånger kan den göra olika saker beroende på vad som finns i lådorna.

Säg att vi vill plantera en blomma i en trädgård. Vi har en praktisk funktion, `plant` (plantera), med en enda indata: positionen där vi vill placera blomman. Så om vi vill placera en blomma 10 från kanten skriver vi så här:

```javascript
plant(10)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/flowers-same-spot.webp"
  alt="En blomma planterad i en trädgård bredvid Jikis tavla"
  width="406"
  height="400"
/>

Men om vi vill plantera åtta blommor då? Vi skulle kunna skriva `plant(10)`, `plant(20)`, `plant(30)` och så vidare, men det blir ganska tjatigt.

Och vi har redan lärt oss något som hjälper oss att slippa den här sortens tjatiga kod. Använd en loop! Använd ett `repeat`-block! Så nu sätter vi positionen till 10 och lägger sedan ett `repeat`-block där vi anropar `plant`, alltså använder `plant`-funktionen, åtta gånger.

```javascript
let position = 10
repeat(8) {
  plant(position)
}
```

Vad tror du kommer att hända?

Jo, den kommer att plantera åtta blommor, men den planterar dem på samma ställe varje gång, och det var ju inte riktigt det vi ville. Så nu stannar vi upp en stund och funderar på vad Jiki gör här. Han gör en låda med etiketten position. Han lägger 10 i den. Sedan kör han `plant`-maskinen åtta gånger. Varje gång tar han ut värdet ur position-lådan. Det är alltid 10, och han matar in samma 10 varje gång.

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-loop-walkthrough.webp"
  alt="Jiki tar ner position-lådan från hyllan och matar in dess värde 10 i plant-maskinen"
  width="400"
  height="400"
/>

Det vi behöver är alltså ett sätt att flytta oss en liten bit varje gång. När vi har planterat en blomma vill vi säga åt Jiki att flytta fram positionen 10, så att han är redo att plantera nästa blomma.

Så om vi glömmer koden för en stund: hur ser det ut rent logiskt? Om jag säger till dig: ”Plantera den första blomman vid 10, nästa vid 20 och nästa vid 30”, hur vet din hjärna att nästa ska planteras vid 40 och den efter det vid 50?

Det din hjärna gör är att hålla koll på det aktuella talet, lägga till 10 och sedan uppdatera talet i huvudet.

Och exakt samma sak kan vi göra i kod. Vi säger: ”Uppdatera (_update_ på engelska) position-lådan så att den innehåller det aktuella positionsvärdet plus 10.”

När Jiki ser det här tar han ut det aktuella talet ur position-lådan, lägger till 10, gör den matten och lägger ihop dem, och lägger sedan tillbaka resultatet i lådan inför nästa gång.

```javascript
position = position + 10
```

<img
  class="concept-image"
  src="/static/images/concept-assets/updating-variables/jiki-updating-box.webp"
  alt="Jiki tar ut 10 ur position-lådan, lägger till 10 så att det blir 20 och lägger tillbaka 20 i lådan"
  width="427"
  height="400"
/>

Så om vi lägger in det här i vårt program, så att vi nu säger ”Sätt positionens startvärde till 10”, sedan planterar en blomma vid positionen åtta gånger och varje gång ändrar positionen till 10 mer än förut, då fungerar vår kod, och vi får åtta blommor med jämna mellanrum.

Lägg märke till att det inte står något `let` (låt) när vi uppdaterar variabeln. Det är jätteviktigt. När Jiki ser `let` skapar han en ny låda. Men här vill vi inte skapa en ny låda. Vi vill ändra vad som finns i lådan vi redan har.

Notera också att vi bara skapar lådan en gång, utanför loopen. Det är viktigt att komma ihåg. Skapa lådan en gång högst upp, och uppdatera den sedan varje gång loopen kör.

Vi kan uppdatera vad som finns i lådor, och den kraften kan vi använda för att hålla koll på något som förändras över tid. Du kommer att använda det här mönstret hela tiden: hålla koll på en position, räkna hur många gånger något har hänt, hålla räkning på poäng. När du behöver komma ihåg något som förändras medan programmet kör, då är det så här du gör.
