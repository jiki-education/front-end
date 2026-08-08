---
title: "If-statements"
description: "Het sleutelwoord `if` gebruiken om een blok code alleen uit te voeren als een bepaalde voorwaarde waar is, zoals een uitsmijter die mensen binnenlaat."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Er is een sleutelwoord waarmee we Jiki kunnen vertellen dat hij bepaalde dingen alleen in bepaalde situaties moet doen. Misschien schrijf je code om de ingang van een bar te bewaken, ben je de uitsmijter, en mag Jiki de deur alleen openen als iemand netjes gekleed is. Of misschien schrijf je code waarin jij aan het einde van een race met de finishvlag mag zwaaien, maar moet Jiki weten dat hij dat alleen in de laatste ronde moet doen. In dit soort situaties gebruiken we het sleutelwoord `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki als uitsmijter die beslist of hij mensen binnenlaat in de nachtclub"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki staat klaar om aan het einde van een race met de finishvlag te zwaaien"
  width="266"
  height="400"
/>

We gebruiken het sleutelwoord `if` op vrijwel dezelfde manier als `repeat`. We zetten wat informatie tussen gewone haakjes. In dit geval is die informatie de voorwaarde (_condition_ in het Engels) die we controleren. En daarna zetten we tussen de accolades een blok code dat we alleen uitvoeren als die voorwaarde waar is.

```javascript
if (condition) {
}
```

Hoe zien die voorwaarden er dan uit? Nou, meestal is het een soort vergelijking (_comparison_ in het Engels). We vergelijken twee getallen of strings en controleren of het resultaat waar of onwaar is.

Zie ze als beweringen (_statements_ in het Engels) die je hardop zou kunnen uitspreken. Drie is kleiner dan vijf. Dat is waar. Zeven is kleiner dan twee. Dat is onwaar.

We gebruiken symbolen om deze vergelijkingen op te schrijven. Waarschijnlijk ken je ze al van wiskunde. We hebben kleiner dan, groter dan, kleiner dan of gelijk aan, groter dan of gelijk aan, en we hebben ook een controle om te kijken of twee dingen hetzelfde zijn, of ze gelijk zijn. En die is net iets anders dan je waarschijnlijk gewend bent, want we gebruiken drie gelijktekens achter elkaar om te kijken of twee dingen hetzelfde of verschillend zijn.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Een tabel met vergelijkingsoperatoren: kleiner dan, groter dan, kleiner dan of gelijk aan, groter dan of gelijk aan, gelijk aan en niet gelijk aan, met voorbeelden"
  width="449"
  height="400"
/>

Zo raken we niet in de war met het instellen of bijwerken van variabelen, waarbij we één gelijkteken gebruiken om te zeggen: zet dit in de doos. Onthoud dus: drie gelijktekens om te vergelijken.

Je kunt ook strings vergelijken. Dus `"hello"` is gelijk aan `"hello"`. Dat is waar. De twee strings zijn hetzelfde. Maar wees hier voorzichtig, want Jiki vergelijkt elk afzonderlijk teken (_character_ in het Engels) van beide strings op de twee papiertjes. Dus `"Hello"` met een hoofdletter H is niet gelijk aan `"hello"` met een kleine h. Het zijn verschillende strings. Die vergelijking zou dus onwaar zijn, omdat de hoofdletter H en de kleine letter h verschillende tekens zijn.

O, en trouwens: waar en onwaar worden _Booleans_ (booleaanse waarden) genoemd, en dat is weer zo'n technisch klinkend woord. Maar het is echt heel simpel. Het is gewoon een formele manier om te zeggen dat iets waar of onwaar is. Kom je het woord Booleans tegen, dan betekent het dus gewoon waar of onwaar. Laten we dit in actie zien. Stel dat we die robotuitsmijter voor een club bouwen, en we zeggen dat de uitsmijter de deur alleen mag openen als iemand 21 jaar of ouder is. We hebben dus een functie `askAge` (vraag de leeftijd), die we kunnen gebruiken om iemands leeftijd op te vragen, en het resultaat daarvan slaan we op in een variabele met de naam `age` (leeftijd). En dan kunnen we zeggen: als die `age` groter is dan 20, openen we de deur. Dus als `askAge` `30` teruggeeft, openen we de deur, en als hij `12` teruggeeft, doen we dat niet.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki opent de deur voor iemand die oud genoeg is en weigert iemand die te jong is de toegang"
  width="410"
  height="400"
/>
