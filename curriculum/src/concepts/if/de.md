---
title: "if-Anweisungen"
description: "Mit dem Schlüsselwort `if` einen Block Code nur dann ausführen, wenn eine Bedingung wahr ist, wie ein Türsteher, der Leute hereinlässt."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Es gibt ein Schlüsselwort, mit dem wir Jiki sagen können, dass er bestimmte Dinge nur in bestimmten Situationen tun soll. Vielleicht schreibst du Code, der den Eingang einer Bar bewacht, vielleicht bist du Türsteher, und Jiki soll die Tür nur öffnen, wenn jemand passend angezogen ist. Oder vielleicht schreibst du Code, in dem du am Ende eines Rennens die Zielflagge schwenken darfst, aber Jiki muss wissen, dass er das nur in der letzten Runde tun soll. In solchen Situationen benutzen wir das Schlüsselwort `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki als Türsteher, der entscheidet, ob er Leute in den Nachtclub lässt"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki bereit, am Ende eines Rennens die Zielflagge zu schwenken"
  width="266"
  height="400"
/>

Das Schlüsselwort `if` benutzen wir ganz ähnlich wie `repeat`. Wir schreiben eine Information in zwei runde Klammern. In diesem Fall ist diese Information die Bedingung (_condition_ auf Englisch), die wir prüfen. Und dann kommt in die geschweiften Klammern ein Block mit Code, den wir nur ausführen, wenn diese Bedingung wahr ist.

```javascript
if (condition) {
}
```

Wie sehen diese Bedingungen nun aus? Normalerweise sind sie eine Art Vergleich (_comparison_ auf Englisch). Wir vergleichen zwei Zahlen oder Strings und prüfen, ob das Ergebnis wahr oder falsch ist.

Stell dir diese also als Aussagen (_statements_ auf Englisch) vor, die du laut aussprechen könntest. Drei ist kleiner als fünf. Das ist wahr. Sieben ist kleiner als zwei. Das ist falsch.

Um diese Vergleiche zu schreiben, benutzen wir Symbole. Die meisten kennst du wahrscheinlich schon aus dem Matheunterricht. Es gibt kleiner als, größer als, kleiner oder gleich und größer oder gleich, und außerdem eine Prüfung, ob zwei Dinge gleich sind. Und die sieht ein bisschen anders aus, als du es wahrscheinlich gewohnt bist, denn wir schreiben drei Gleichheitszeichen hintereinander, um zu prüfen, ob zwei Dinge gleich oder verschieden sind.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Eine Tabelle mit Vergleichsoperatoren: kleiner als, größer als, kleiner oder gleich, größer oder gleich, gleich und ungleich, mit Beispielen"
  width="449"
  height="400"
/>

Das hilft uns, es nicht mit dem Setzen oder Aktualisieren von Variablen zu verwechseln, wo ein einzelnes Gleichheitszeichen bedeutet: Leg das in die Box. Merk dir einfach: drei Gleichheitszeichen zum Vergleichen.

Auch Strings kannst du vergleichen. `"hello"` ist gleich `"hello"`. Das ist wahr. Die beiden Strings sind gleich. Aber sei hier vorsichtig, denn Jiki vergleicht jedes einzelne Zeichen (_character_ auf Englisch) in beiden Strings, auf beiden Zetteln. `"Hello"` mit großem H ist also nicht gleich `"hello"` mit kleinem H. Das sind verschiedene Strings. Dieser Vergleich wäre also falsch, denn das große H und das kleine H sind verschiedene Zeichen.

Übrigens: wahr und falsch heißen boolesche Werte (_Booleans_ auf Englisch), und das ist wieder so ein technisch klingendes Wort. Aber es ist ganz einfach. Es ist nur eine formelle Art zu sagen, dass etwas entweder wahr oder falsch ist. Wenn dir das Wort boolesche Werte also irgendwo begegnet, bedeutet es einfach wahr oder falsch. Schauen wir uns das in Aktion an. Stell dir vor, wir bauen diesen Roboter-Türsteher für einen Club, und wir legen fest, dass der Türsteher die Tür nur öffnen soll, wenn die Person 21 oder älter ist. Wir haben also eine Funktion `askAge` (nach dem Alter fragen), mit der wir jemandes Alter herausfinden können, und ihr Ergebnis speichern wir in einer Variablen namens `age` (Alter). Dann können wir sagen: Wenn dieses `age` größer als 20 ist, öffnen wir die Tür. Wenn `askAge` also `30` zurückgibt, öffnen wir sie, und wenn es `12` zurückgibt, nicht.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki öffnet die Tür für jemanden, der alt genug ist, und verwehrt jemandem, der zu jung ist, den Eintritt"
  width="410"
  height="400"
/>
