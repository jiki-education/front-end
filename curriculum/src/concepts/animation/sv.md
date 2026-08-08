---
title: "Animation"
description: "Att lura ögat att se rörelse genom att måla över bakgrunden och rita om varje bildruta i ett lite nytt läge."
en_md5: 536994294072afea52dab51d3bb7cab8
---

Hittills, när vi har använt en `repeat`-loop (upprepa) för att rita saker, har varje ny sak vi ritat lagt till något i bilden. Om vi har ritat en ny tegelsten i en mur har den fyllt en lucka. Om vi har ritat 10 cirklar ser vi 10 cirklar på skärmen. Det är som en målning. När du väl har satt färg på väggen försvinner den inte när du målar något nytt bredvid. Den sitter kvar. Men tänk om vi vill få något att se ut som att det rör sig?

Har du någon gång sett en blädderbok? De var riktigt populära när jag var liten, mindre så i dag. En blädderbok är en liten bok där varje sida har en teckning som skiljer sig lite från den förra. När du bläddrar snabbt genom sidorna ser dina ögon teckningarna förändras, och din hjärna tror att något rör sig. Det rör sig inte på riktigt. Det är bara många lite olika bilder, en efter en. Och det är precis så animation fungerar i kod. Tricket är detsamma. Innan vi ritar en ny scen målar vi över hela canvasen med en bakgrundsfärg, ungefär som att börja på en ny sida i vår blädderbok, och sedan gör vi en liten ändring i scenen så att det ser ut som rörelse.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/flip-book-pages.webp"
  alt="En blädderbok som visar en streckgubbe som springer, där varje sida skiljer sig lite så att figuren ser ut att röra sig"
  width="500"
  height="274"
/>

Så om vi tar ett välbekant kodblock där vi ritar cirklar över skärmen: vi sätter en variabel `position`, och vi har ett `repeat`-block där vi ritar en cirkel och sedan flyttar `position` ett steg åt höger. Om vi kör det där `repeat`-blocket 100 gånger kommer vi att se 100 cirklar över skärmen.

```javascript
let position = 0
repeat(100) {
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circles-trail.webp"
  alt="Ett spår av 100 blå cirklar ritade från vänster till höger över skärmen"
  width="500"
  height="197"
/>

Titta nu vad som händer om vi bara lägger till en enkel rektangel innan vi ritar cirkeln varje gång.

```javascript
let position = 0
repeat(100) {
  rectangle(0, 0, 100, 100, "white")
  circle(position, 50, 5, "blue")
  position = position + 1
}
```

I stället för ett spår av cirklar luras våra ögon nu att se en enda cirkel som verkar glida över skärmen.

<img
  class="concept-image"
  src="/static/images/concept-assets/animation/circle-glide-frames.webp"
  alt="En sekvens av bildrutor, var och en en ny vit canvas med en enda blå cirkel ett steg längre till höger"
  width="500"
  height="187"
/>

Varje gång vi går igenom loopen målar vi en helt ny bakgrund, som täcker allt som fanns där innan, och sedan ritar vi cirkeln på dess nya plats.

Varje varv i loopen är som en ny sida i blädderboken.

Och det viktiga att förstå här är att vi inte flyttar cirkeln. Cirkeln är inget objekt som glider fram. Den är bara en teckning. Varje varv i loopen målar vi över den gamla teckningen och gör en helt ny, lite längre till höger. Ditt öga sätter ihop alltihop och ser rörelse, men egentligen är det bara många separata teckningar, en efter en.

Du kan använda den här idén för att skapa en solnedgång. Du får solen att röra sig, ändrar dess storlek, ändrar dess färg. Allt är samma teknik. Sätt några variabler, måla en ny bakgrund och rita allting. Uppdatera variablerna, och upprepa sedan.
