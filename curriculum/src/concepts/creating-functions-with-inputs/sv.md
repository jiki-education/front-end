---
title: "Lägga till indata i funktioner"
description: "Lägg till inkast på dina egna funktioner så att de kan göra olika saker utifrån värdena som skickas in."
en_md5: f70d737888fcbda3306196ff069eb2f1
---

Funktionerna du har byggt hittills gör exakt samma sak varje gång. `turnAround` (vänd om) svänger alltid vänster två gånger. `shootIfAlienAbove` (skjut om en rymdvarelse är ovanför) kontrollerar alltid och skjuter.

Men tänk på funktionerna du har använt under kursen, och hur de gör olika saker beroende på sina indata. Rectangle tar en vänsterposition, en topposition, en bredd och en höjd som indata, och ritar sedan olika rektanglar beroende på vad du säger åt den.

Nu ska vi lägga till inkast på dina egna funktioner också.

Du behöver veta två saker för att göra det här. Det första är hur det ser ut i koden, alltså vad du behöver skriva, och det andra är vad som faktiskt händer.

Den första delen är ganska enkel. Du lägger bara till ett par vanliga parenteser och sedan namnen på de indata du vill ha.

Så tänk dig att vi skapar en funktion som ska skjuta många gånger. Vi kallar den `shootMany` (skjut många gånger).

Vi skriver den så här:

```javascript
function shootMany(numShots) {
  // ...
}
```

När du vill använda funktionen anropar du den med antalet skott du vill ha:

```javascript
shootMany(5)
shootMany(2)
```

Och nu kommer det viktiga. När koden körs, vad du än stoppar in i inkastet, `5` eller `2`, så tar mini-Jiki, han med hatten inne i funktionen, emot det, lägger det i en låda som heter `numShots` (antal skott) och ställer sedan lådan på hyllan inne i funktionen så att du kan använda den i funktionens kod.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-box.webp"
  alt="Mini-Jiki inne i shootMany-maskinen lägger indatat i en låda med etiketten numShots"
  width="500"
  height="376"
/>

Jag säger det en gång till.

När vi skriver `shootMany(5)` för att använda funktionen går Jiki på utsidan och hämtar en `5` och stoppar den i inkastet på `shootMany`. Inne i maskinen tar mini-Jiki ut den där `5`:an och lägger den i en låda som heter `numShots`, eftersom det är namnet du gav inkastet, och sedan ställer han lådan på hyllan inne i funktionen inne i maskinen.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/numshots-on-shelf.webp"
  alt="Mini-Jiki ställer lådan numShots på hyllan inne i shootMany-maskinen"
  width="500"
  height="302"
/>

Och inne i funktionen kan du sedan använda lådan `numShots` precis som vilken annan låda som helst. Det är inget magiskt med namnet `numShots`. Vi hade kunnat kalla den vad som helst. Det är helt enkelt en instruktion till mini-Jiki: skapa alltid en låda med den etiketten inne i funktionen och lägg det som skickas in i inkastet i lådan.

Och när du väl har ett värde i lådan kan du göra allt du normalt gör med lådor. Du kan till exempel använda lådan `numShots` i en `repeat`-loop för att skjuta rätt antal gånger. Du kan också ha fler än ett inkast. Separera dem bara med kommatecken. Så om vi har en funktion som heter `drawStar` (rita en stjärna) som ritar en stjärna utifrån sin position uppe till vänster, skriver du den så här:

```javascript
function drawStar(left, top) {
  // ...
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-two-slots.webp"
  alt="Maskinen drawStar med två inkast som tar emot två olika värden"
  width="453"
  height="400"
/>

Och när funktionen sedan anropas lägger mini-Jiki helt enkelt värdena som skickas in i inkasten i lådor som heter `left` (vänster) och `top` (topp), och ställer dem sedan på hyllan inne i funktionen.

<img
  class="concept-image"
  src="/static/images/concept-assets/creating-functions-with-inputs/draw-star-boxes-shelf.webp"
  alt="Mini-Jiki ställer de två indatavärdena i lådor med etiketterna left och top på hyllan inne i drawStar-maskinen"
  width="431"
  height="400"
/>
