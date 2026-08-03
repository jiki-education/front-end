---
title: "Variablen erstellen und verwenden"
description: "Boxen auf Jikis Regalen, die einen Wert mit einem Etikett speichern, damit du ihn später in deinem Code wieder herausholen kannst."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Variablen sind das, womit wir Informationen speichern. Beim Programmieren müssen wir oft eine Zahl oder einen String aufbewahren, um sie später zu verwenden, und genau dafür sind Variablen da. Zoomen wir also in Jikis Lagerhalle ein Stück heraus, dann siehst du, dass er noch eine zweite Reihe Regale hat. Die erste Reihe kennen wir schon: Dort stehen die Funktionen, diese kleinen Maschinen wie `move` und `rectangle`. Auf dieser zweiten Reihe Regale siehst du aber keine Maschinen, sondern lauter Boxen, und diese Boxen nennen wir Variablen. Du kannst Jiki sagen, dass er irgendetwas in diesen Boxen ablegen soll, und ihn später bitten, es wieder herauszuholen. Jede Box hat einen Namen, genau wie Funktionen einen Namen haben, und jede Box enthält genau eine Sache. Fürs Erste entweder eine Zahl oder einen String. Später im Kurs schauen wir uns aber an, wie man auch komplexere Dinge darin speichert.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Zwei Regalreihen in Jikis Lagerhalle: eine mit der Aufschrift Funktionen voller Maschinen, eine mit der Aufschrift Variablen voller Boxen"
  width="500"
  height="173"
/>

Wie sagen wir Jiki also, dass er eine Box bauen und etwas hineinlegen soll? Dafür verwenden wir das Schlüsselwort `let` (lassen). Das Schlüsselwort `let` sagt Jiki, dass er eine neue Box bauen muss. Stell dir vor, wie er einen Karton aus der Verpackung nimmt, ihn zusammenbaut und dann auf das schaut, was nach dem Wort `let` kommt. Das ist das Etikett, das er auf die Box klebt, in diesem Fall `name`. Er holt also seinen Stift heraus und schreibt `name` auf das Etikett. Dann schaut er auf das, was nach dem Gleichheitszeichen (_equal sign_ auf Englisch) kommt. In diesem Fall ist es mein Name, `"Jeremy"`, und weil `"Jeremy"` ein String ist, nimmt er ein Blatt Papier und schreibt `"Jeremy"` darauf. Es ist einfach ein String, genau wie die Farben, mit denen du bisher gearbeitet hast, und dann legt er dieses Blatt Papier in die Box.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki hält ein Blatt Papier mit dem String Jeremy darauf, bereit, es in die Box zu legen"
  width="373"
  height="400"
/>

Wir haben ihm also gesagt, dass er eine Box bauen, ein Etikett daraufkleben und etwas hineinlegen soll, und jetzt stellt er die Box ins Regal. Und zu jedem anderen Zeitpunkt in deinem Programm kann Jiki die Box wieder aus dem Regal holen und nachsehen, was darin liegt. Fang an, dir dieses Denkmodell aufzubauen. Ich programmiere schon ewig, und ich stelle mir beim Schreiben von Code immer noch vor, dass ich etwas in eine Box lege und es später wieder herausholen werde. Wenn du das Schlüsselwort `let` siehst, denk wirklich: „Okay, das heißt, ich baue eine neue Box.“

Ein Wort zu den Namen von Variablen, also den Etiketten auf diesen Boxen. Dafür haben wir ein paar Regeln. Erstens dürfen Variablennamen keine Leerzeichen enthalten. Wenn du mehrere Wörter für das Etikett einer Box verwenden willst, schieben wir die Wörter direkt aneinander und machen den ersten Buchstaben jedes Wortes zu einem Großbuchstaben. Das nennen wir Camel Case. Stell dir vor, wie die Höcker eines Kamels den ersten Buchstaben jedes neuen Wortes zu einem Großbuchstaben hochdrücken. Wenn du also ein Etikett willst, das „mein Name“ bedeutet, schreiben wir statt zwei Wörtern mit Leerzeichen ein einziges Wort mit großem N: `myName`.

Außerdem muss jeder Variablenname einmalig sein. Es darf keine zwei Boxen mit demselben Etikett geben, und Variablen dürfen auch nicht denselben Namen haben wie Funktionen. Wenn du das vergisst, ist Jiki verwirrt und gibt dir eine Fehlermeldung.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki schaut verwirrt auf zwei Boxen, die beide das Etikett name tragen"
  width="485"
  height="400"
/>

Schauen wir uns also an, wo wir eine Variable gebrauchen könnten. Sagen wir, wir zeichnen eine Sonne am Himmel. Wir wissen, dass wir die Funktion `circle` (Kreis) verwenden und ihr vier Eingabewerte geben können: `left` (links), `top` (oben), `radius` und `color` (Farbe). Aber wenn wir viele Dinge zeichnen und all diese Zahlen überall in unserem Code verstreut sind, wird es richtig schwer, den Überblick zu behalten und den Code zu lesen. Stattdessen können wir für left, top, `radius` und `color` jeweils eine Variable erstellen und uns später auf diese Variablen beziehen. Unser Ziel ist es also, die Funktion `circle` zu verwenden und dabei schöne, gut lesbare Namen von Boxen anzugeben. Wenn Jiki diese Namen sieht, weiß er, dass er die Boxen aus den Regalen holen und das verwenden soll, was darin liegt.

Erstellen wir also ein paar Variablen dafür. Wir beginnen mit der linken Position der Sonne. Mit dem Schlüsselwort `let` sagen wir Jiki, dass er eine neue Box namens `leftPosition` (linke Position) erstellen soll. Beachte das Camel Case mit dem großen P. Und wir sagen Jiki, welche Zahl in die Box kommt. Er stellt sie ins Regal und macht dann dasselbe für `topPosition` (obere Position), `radius` und `color`.

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
  alt="Beschriftete Boxen auf den Variablen-Regalen, jede mit einem Wert, den Jiki später holen kann"
  width="500"
  height="378"
/>

Zu jedem Zeitpunkt in unserem Code können wir uns wieder auf diese Variablen beziehen, und Jiki holt die Werte (_values_ auf Englisch) heraus und wirft sie in eine Maschine. Das andere Tolle an Variablen: Immer wenn wir etwas an derselben Position wie die Sonne zeichnen wollen, können wir dieselben Variablen `leftPosition` und `topPosition` wiederverwenden. Nimm ein anderes Beispiel. Stell dir vor, du baust eine Mauer aus 30 Ziegeln, und alle Ziegel sollen gleich breit und gleich hoch sein. Da ist es viel besser, am Anfang deines Codes Variablen für Breite und Höhe zu erstellen und dich im restlichen Code immer wieder auf sie zu beziehen. Denn wenn du die Breite oder die Höhe dann ändern willst, änderst du sie einfach an einer Stelle, und alles andere passt sich mit an.
