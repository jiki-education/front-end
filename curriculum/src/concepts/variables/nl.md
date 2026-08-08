---
title: "Variabelen maken en gebruiken"
description: "Dozen op Jiki's planken die een waarde met een label bewaren, zodat je die later in je code weer kunt ophalen."
en_md5: 6fca9aed7a4f51de337288e739f8b44a
---

Variabelen zijn de manier om informatie op te slaan. Tijdens het programmeren willen we vaak een getal of een string bewaren om later te gebruiken, en dat doen we met variabelen. Laten we dus wat uitzoomen in Jiki's loods, dan zie je dat hij nog een set planken heeft. De eerste planken kennen we al: daar staan de functies op, die kleine machines zoals `move` en `rectangle`. Maar op deze tweede set planken staan geen machines, maar allemaal dozen, en die dozen noemen we variabelen. Je kunt Jiki van alles in deze dozen laten opbergen en hem later vragen om het er weer uit te halen. Elke doos heeft een naam, precies zoals functies een naam hebben, en in elke doos zit precies één ding. Voorlopig is dat een getal of een string, maar verderop in de cursus kijken we naar het opslaan van complexere dingen.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Twee sets planken in Jiki's loods: één met het label functies waar machines op staan, één met het label variabelen waar dozen op staan"
  width="500"
  height="173"
/>

Hoe vertellen we Jiki dan dat hij een doos moet maken en er iets in moet stoppen? Daarvoor gebruiken we het sleutelwoord `let` (laat). Het sleutelwoord `let` vertelt Jiki dat hij een nieuwe doos moet maken. Stel je voor dat hij een kartonnen doos uit de verpakking haalt en in elkaar zet. Daarna kijkt hij naar wat er na het woord `let` staat: dat is het label dat hij op de doos plakt, in dit geval `name` (naam). Hij pakt zijn pen en schrijft `name` op het label. Vervolgens kijkt hij naar wat er na het isgelijkteken (_equal sign_ in het Engels) staat. In dit geval is dat mijn naam, `"Jeremy"`, en omdat `"Jeremy"` een string is, pakt hij een stuk papier en schrijft hij `"Jeremy"` erop. Het is gewoon een string, precies zoals de kleuren waarmee je al gewerkt hebt. Daarna stopt hij dat stuk papier in de doos.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki met een stuk papier waarop de string Jeremy geschreven staat, klaar om het in de doos te stoppen"
  width="373"
  height="400"
/>

We hebben hem dus gevraagd om een doos te maken, er een label op te plakken en er iets in te stoppen, en nu zet hij de doos op de plank. Op elk ander moment in je programma kan Jiki die doos weer van de plank pakken en kijken wat erin zit. Begin dit mentale model op te bouwen. Ik programmeer al een eeuwigheid, en nog steeds stel ik me bij het schrijven van code voor dat ik iets in een doos stop om het er later weer uit te halen. Als je het sleutelwoord `let` ziet, denk dan echt: "Oké, dat betekent dat ik een nieuwe doos maak."

Nog even over de namen van variabelen, de labels op deze dozen. Daar hebben we een paar regels voor. Ten eerste mogen er geen spaties in variabelenamen staan. Wil je meerdere woorden gebruiken voor het label van een doos, dan schuiven we de woorden tegen elkaar aan en maken we van de eerste letter van elk woord een hoofdletter. Dit noemen we camel case. Stel je de bulten van een kameel voor die de eerste letter van elk nieuw woord omhoog duwen tot een hoofdletter. Wil je dus als label mijn naam ("my name") gebruiken, dan schrijven we die niet als twee woorden met een spatie ertussen, maar als één woord met de N als hoofdletter: `myName`.

Daarnaast moet elke variabelenaam uniek zijn. Je kunt geen twee dozen met hetzelfde label hebben, en variabelen mogen ook niet dezelfde naam hebben als functies. Vergeet je dat, dan raakt Jiki in de war en krijg je een foutmelding.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki kijkt verward naar twee dozen die allebei het label name hebben"
  width="485"
  height="400"
/>

Laten we eens kijken waar we een variabele zouden willen gebruiken. Stel dat we een zon aan de hemel tekenen. We weten dat we de functie `circle` (cirkel) kunnen gebruiken en die vier invoerwaarden kunnen geven: `left` (links), `top` (boven), `radius` (straal) en `color` (kleur). Maar als we veel dingen tekenen en al die getallen door onze code verspreid staan, wordt het lastig om het overzicht te houden en de code te lezen. In plaats daarvan kunnen we voor elk van left, top, `radius` en `color` een variabele maken en daar later naar verwijzen. Ons einddoel is dus dat we de functie `circle` kunnen gebruiken met mooie, leesbare namen van dozen, en dat Jiki, als hij die namen ziet, weet dat hij de dozen van de planken moet pakken en moet gebruiken wat erin zit.

Laten we dus wat variabelen maken. We beginnen met de linkerpositie van de zon. Met het sleutelwoord `let` vertellen we Jiki dat hij een nieuwe doos moet maken met de naam `leftPosition` (linkerpositie). Let op de camel case daar, met de hoofdletter P. En we vertellen Jiki welk getal er in de doos gaat. Hij zet hem op de planken en doet daarna hetzelfde voor `topPosition` (bovenpositie), `radius` en `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Dozen met labels op de variabelenplanken, elk met één waarde erin die Jiki later kan ophalen"
  width="500"
  height="378"
/>

Op elk moment in onze code kunnen we naar deze variabelen verwijzen, en dan haalt Jiki de waarden (_values_ in het Engels) eruit en stopt hij ze in een machine. Het andere mooie aan variabelen is dat we, elke keer als we iets op dezelfde positie als de zon willen tekenen, diezelfde variabelen `leftPosition` en `topPosition` kunnen hergebruiken. Neem een ander voorbeeld. Stel dat je een muur bouwt van 30 bakstenen, en je wilt dat alle bakstenen dezelfde breedte en dezelfde hoogte hebben. Dan is het veel handiger om aan het begin van je code variabelen voor de breedte en de hoogte te maken en daar in de rest van je code naar te verwijzen. Want als je de breedte of de hoogte wilt aanpassen, hoef je dat maar op één plek te doen, en al het andere wordt automatisch bijgewerkt.
