---
title: "Functies gebruiken"
description: "Zeg tegen Jiki dat hij een van zijn kleine machines moet gebruiken: schrijf de naam en daarachter twee haakjes."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Als je code schrijft, vertel je eigenlijk in een taal die een computer begrijpt wat je wilt laten gebeuren. Er bestaan heel veel verschillende programmeertalen, en er zijn ook heel veel verschillende interpreters (_tolk_) die omzetten wat jij schrijft naar de enen en nullen die een computer kan begrijpen. In deze cursus is jouw interpreter Jiki. De hele cursus is naar Jiki vernoemd. Dit is Jiki. Jiki wordt je vriend op deze programmeerreis. Het is zijn taak om de code die jij schrijft te interpreteren en om te zetten in de enen en nullen waar de computer echt iets mee kan doen.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, de vriendelijke interpreter die je door deze cursus begeleidt"
  width="421"
  height="400"
/>

Waar het bij programmeren om gaat, is dat je de interpreter, in dit geval Jiki, de juiste instructies geeft. En je kunt Jiki heel veel verschillende instructies geven, want hij begrijpt er heel veel. Hij kan dingen aan elkaar plakken, hij kan iets heel vaak achter elkaar doen, en hij kan zeggen: "Als dit gebeurt, dan moet ik dat doen." Hij kan dingen onthouden en ze later weer gebruiken. En als er iets niet klopt, kan hij je een fout (_error_ in het Engels) geven. Al die dingen komen in deze cursus aan bod. Maar het belangrijkste om te begrijpen is dit: alles wat je gaat doen, komt erop neer dat je instructies op een whiteboard schrijft, waarna Jiki langskomt om ze te volgen.

Toen ik 34 jaar geleden leerde programmeren, bouwde ik dit mentale model op, en het is nog steeds het model dat ik vandaag gebruik. Ik begrijp hoe computers werken, tot op het niveau van de enen en nullen, maar eerlijk gezegd denk ik daar nooit aan. In mijn hoofd woont er een klein mannetje in de computer, en ik vertel hem wat hij moet doen. Ga dus even met mij mee. Het is een krachtig mentaal model dat je kunt opbouwen, en als je op deze heel visuele manier gaat nadenken over wat dat mannetje in de computer doet, dan heb je daar veel aan terwijl je leert programmeren.

Laten we beginnen met een van de meest fundamentele begrippen in het programmeren: functies (_functions_ in het Engels). Functies zijn net kleine machines die je Jiki kunt laten gebruiken. En als we in Jiki's loods kijken, daar hangt hij namelijk rond, dan zie je dat hij een plank heeft met drie verschillende machines erop: `move` (beweeg), `turnLeft` (draai naar links) en `turnRight` (draai naar rechts).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Een plank in Jiki's loods met drie machines: move, turnLeft en turnRight"
  width="500"
  height="371"
/>

Toen je `move` schreef en daarachter die twee haakjes, zei je daarmee tegen Jiki dat hij de `move`-machine van de plank moest pakken, aan de slinger moest draaien om hem aan te zetten, en hem moest gebruiken.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki rijdt de move-machine van de plank af om hem te gebruiken"
  width="439"
  height="400"
/>

Toen je `turnLeft` schreef en daarachter de haakjes, zei je tegen Jiki dat hij de `turnLeft`-machine van de plank moest pakken en moest gebruiken. En dit is het patroon dat je steeds opnieuw gaat gebruiken. Wil je een machine gebruiken, dan schrijf je de naam ervan op en daarachter die haakjes, en daarmee zeg je tegen Jiki dat hij de machine moet halen en gebruiken:

```javascript
move()
turnLeft()
```

Hoe die machine precies werkt, wat er binnenin gebeurt, daar hoeven we ons nu nog geen zorgen over te maken. Daar kijken we later veel uitgebreider naar. Het duurt zelfs niet lang meer voordat je je eigen machines kunt maken. Maar voor nu: geen zorgen. Bij elke opdracht krijg je te horen welke machines er op Jiki's plank staan. Voor elke opdracht zijn dat andere machines, en met die machines kun je de opdrachten oplossen.
