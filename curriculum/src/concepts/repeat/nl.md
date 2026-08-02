---
title: "De repeat-loop"
description: "Met het sleutelwoord `repeat` vertel je Jiki dat hij de code tussen de accolades een bepaald aantal keren moet uitvoeren."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Tot nu toe is alles op een lineaire manier geschreven: Jiki volgt elke instructie op volgorde, van boven naar beneden.

Nu gaan we kijken hoe Jiki uit die strikte volgorde van boven naar beneden kan breken, en vooral hoe we Jiki hetzelfde stuk code een heleboel keer achter elkaar kunnen laten uitvoeren.

Stel je bijvoorbeeld voor dat je in het doolhof staat en 10 stappen vooruit wilt. Er is een `walk`-functie die daarbij helpt, maar wat als die niet bestond? Wat als je alleen de functie `move` (bewegen) had?

In plaats van 10 keer achter elkaar `move` te schrijven, wat behoorlijk eentonig wordt, willen we kunnen zeggen: "Hé Jiki, doe het volgende wat ik zeg 10 keer.

`Move`."

Om dit in code te doen, gebruiken we ons eerste sleutelwoord (_keyword_ in het Engels). Sleutelwoorden zijn instructies die Jiki begrijpt. Ze lijken een beetje op machines, maar dat zijn ze niet. Als Jiki een sleutelwoord ziet, zoekt hij niet naar een machine op de plank; hij weet gewoon wat hij moet doen. Het zit ingebouwd in zijn brein. Er zijn ongeveer 20 verschillende sleutelwoorden die we tijdens de cursus gaan leren, en het eerste daarvan is het sleutelwoord `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki omringd door sleutelwoorden zoals repeat, if, else, and en or, met de notitie dat sleutelwoorden instructies zijn die Jiki begrijpt"
  width="358"
  height="400"
/>

Het sleutelwoord `repeat` doet precies wat ik hierboven zei. Het vertelt Jiki: "Herhaal wat ik hierna zeg zo vaak als ik aangeef." Kijk eens naar deze code. Eerst gebruiken we het sleutelwoord `repeat` om Jiki te vertellen dat hij iets meerdere keren gaat doen. Daarna zetten we tussen gewone haakjes hoe vaak Jiki het moet herhalen, en dan komen die accolades (`{}`), die gekrulde haakjes. Binnen die accolades staan de dingen die Jiki moet herhalen. Dit patroon kom je bij het programmeren ontzettend vaak tegen: we schrijven een sleutelwoord, meestal met wat extra informatie erbij (in dit geval het aantal keren dat iets moet gebeuren), en daarna een codeblok (_code block_ in het Engels) tussen accolades. Terug naar de doolhofwereld: in plaats van `move`, `move`, `move`, `move` te schrijven, kunnen we schrijven: herhaal vier keer `move`.

```javascript
repeat(4) {
  move()
}
```

Jiki ziet die code en gebruikt de `move`-machine vier keer achter elkaar.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki gebruikt de move-machine vier keer achter elkaar, de ene keer na de andere"
  width="421"
  height="400"
/>

En we zijn niet beperkt tot één ding tussen die accolades. Jiki kan ook meerdere dingen herhaaldelijk doen. We kunnen Jiki vertellen eerst `move` te doen, dan `turnLeft`, en dat geheel vier keer te herhalen. Als Jiki dit ziet, gebruikt hij de `move`-machine, dan de `turnLeft`-machine, dan de `move`-machine, dan de `turnLeft`-machine, dan de `move`-machine, enzovoort, tot hij ze allebei vier keer heeft gedaan.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki gebruikt de move-machine en daarna de turnLeft-machine, en herhaalt dat paar acties vier keer"
  width="500"
  height="390"
/>

Zulke herhaalinstructies noemen we lussen (_loops_ in het Engels), en er zijn veel verschillende lussen die we kunnen gebruiken en die allemaal net iets anders werken.

Er is nog één ding om te weten: je code netjes en overzichtelijk houden wordt essentieel zodra je met lussen werkt. Met een goede visuele structuur in je code zie je heel makkelijk wat er gebeurt. Maar als je dat niet doet, als je vergeet netjes in te springen of je inspringing door elkaar haalt, wordt het razendsnel verwarrend. Daarom hanteren we in deze cursus altijd een regel. Je zet de openingsaccolade altijd op dezelfde regel als het `repeat`-_statement_ (een uitvoerbare instructie). Je zet de sluitaccolade altijd op een eigen regel na het statement, en laat de code ertussen altijd twee spaties inspringen. Zo blijft alles keurig netjes, en als je het vergeet of een ander patroon probeert te volgen, krijg je een foutmelding.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki wijst naar de inspringing en de nieuwe regel die het codeblok van een lus netjes houden"
  width="500"
  height="398"
/>
