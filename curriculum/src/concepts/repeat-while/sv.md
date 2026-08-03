---
title: "Repeat utan antal"
description: "Om du lämnar parenteserna i en repeat-loop tomma fortsätter Jiki tills något annat säger åt honom att stanna."
en_md5: 5902e86c82b7bfe9ca519f9bdf8650ad
---

Hittills, när du har använt repeat-loopen, har du alltid angett ett tal som säger hur många gånger den ska upprepas. Upprepa fem gånger, 10 gånger, 40 gånger. Ibland har du använt en variabel för att göra det. Men du har alltid talat om för Jiki exakt hur många gånger loopen ska köras. Ibland vet vi dock inte i förväg hur många gånger vi behöver upprepa. Tänk på labyrinten. Långt tillbaka i början av kursen löste du labyrinten genom att skriva ut varje drag för sig. Du kunde se labyrinten, räkna stegen och skriva exakt rätt antal drag.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-known-path.webp"
  alt="En labyrint där figuren kan se vägen, räkna stegen och skriva exakt rätt drag"
  width="418"
  height="400"
/>

```javascript
move()
move()
turnLeft()
move()
move()
```

Men tänk om jag sa: ”Skriv kod som kan lösa vilken labyrint jag än ger dig”? Den labyrinten kanske kräver 10 steg, eller 50, eller 200. Du har ingen aning i förväg.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/maze-example.webp"
  alt="Flera olika labyrinter i olika former och storlekar, och Jiki som funderar på hur han ska kunna lösa vilken som helst av dem"
  width="402"
  height="400"
/>

Så du behöver ett sätt att helt enkelt säga åt Jiki att bara fortsätta. Fortsätta kolla vilket håll du kan gå åt, fortsätta fatta beslut, fortsätta framåt, om och om igen tills du är klar.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill.webp"
  alt="Jiki som springer på ett löpband och bara fortsätter, om och om igen"
  width="428"
  height="400"
/>

Och sättet att göra det är riktigt enkelt. Ge bara inte nyckelordet `repeat` något tal. Lämna parenteserna tomma. Om du gör det fortsätter Jiki tills något annat säger åt honom att stanna. Längre fram ska vi titta på vad det där ”något annat” kan vara. Men än så länge fortsätter han bara tills övningen är klar, eller tills han bestämmer sig för att han har hållit på i evigheter, vill ta en paus och har fått nog.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat-while/jiki-treadmill-exhausted.webp"
  alt="Jiki som hänger utmattad över löpbandet efter att ha hållit på i evigheter, redo att ge upp och ta en paus"
  width="500"
  height="378"
/>
