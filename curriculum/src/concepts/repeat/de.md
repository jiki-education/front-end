---
title: "Die repeat-Schleife"
description: "Mit dem Schlüsselwort `repeat` sagst du Jiki, dass er den Code in den geschweiften Klammern eine bestimmte Anzahl von Malen ausführen soll."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Bisher war alles linear aufgebaut: Jiki befolgt jeden Befehl der Reihe nach, von oben nach unten.

Jetzt schauen wir uns an, wie Jiki aus diesem strengen Ablauf von oben nach unten ausbrechen kann. Genauer gesagt: wie wir Jiki sagen können, dass er denselben Abschnitt Code viele Male hintereinander ausführen soll.

Stell dir zum Beispiel vor, du bist im Labyrinth und willst 10 Schritte nach vorne gehen. Dafür gibt es die Funktion `walk`. Aber was, wenn es die nicht gäbe? Was, wenn du nur die Funktion `move` (bewegen) hättest?

Statt `move` 10-mal hintereinander zu schreiben, was ziemlich eintönig wird, wollen wir sagen können: „Hey Jiki, mach das Nächste, was ich sage, 10-mal.

`Move`.“

Um das im Code zu machen, brauchen wir unser erstes Schlüsselwort (_keyword_ auf Englisch). Schlüsselwörter sind Befehle, die Jiki versteht. Sie sehen ein bisschen wie Maschinen aus, sind aber keine. Wenn Jiki ein Schlüsselwort sieht, sucht er nicht nach einer Maschine im Regal. Er weiß einfach, was zu tun ist. Es ist fest in seinem Kopf verankert. Im Laufe des Kurses lernen wir ungefähr 20 verschiedene Schlüsselwörter kennen, und das erste davon ist das Schlüsselwort `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki umgeben von Schlüsselwörtern wie repeat, if, else, and und or, mit dem Hinweis, dass Schlüsselwörter Befehle sind, die Jiki versteht"
  width="358"
  height="400"
/>

Das Schlüsselwort `repeat` macht genau das, was ich oben beschrieben habe. Es sagt Jiki: „Wiederhole das, was ich als Nächstes sage, so viele Male.“ Schau dir diesen Code an. Zuerst benutzen wir das Schlüsselwort `repeat`, um Jiki zu sagen, dass er etwas mehrmals tun wird. Dann schreiben wir in runde Klammern, wie oft Jiki die Sache wiederholen soll. Und dann kommen diese geschweiften Klammern, und in diesen geschweiften Klammern steht das, was Jiki wiederholen soll. Dieses Muster ist in der Programmierung unglaublich verbreitet: Wir schreiben ein Schlüsselwort, meistens mit einer Zusatzinformation (hier: wie oft etwas passieren soll), und dahinter einen Block (_code block_ auf Englisch) in geschweiften Klammern. Zurück in der Labyrinth-Welt: Statt `move`, `move`, `move`, `move` zu schreiben, können wir schreiben: Wiederhole viermal `move`.

```javascript
repeat(4) {
  move()
}
```

Jiki sieht diesen Code und benutzt die `move`-Maschine viermal hintereinander.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki benutzt die move-Maschine viermal hintereinander, einmal nach dem anderen"
  width="421"
  height="400"
/>

Und wir sind nicht darauf beschränkt, nur eine Sache in die geschweiften Klammern zu schreiben. Jiki kann auch mehrere Dinge wiederholt tun. Wir können Jiki sagen, dass er `move` und dann `turnLeft` ausführen soll, und das Ganze viermal wiederholen. Wenn Jiki diesen Code sieht, benutzt er die `move`-Maschine, dann die `turnLeft`-Maschine, dann die `move`-Maschine, dann die `turnLeft`-Maschine, dann die `move`-Maschine und so weiter, bis er beides viermal gemacht hat.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki benutzt die move-Maschine und dann die turnLeft-Maschine und wiederholt die beiden Aktionen viermal"
  width="500"
  height="390"
/>

Diese Wiederholungsbefehle nennen wir Schleifen (_loops_ auf Englisch). Es gibt viele verschiedene Schleifen, die wir benutzen können, und jede funktioniert ein bisschen anders.

Eine Sache musst du noch wissen: Sobald du mit Schleifen arbeitest, ist es wichtig, deinen Code ordentlich zu halten. Wenn dein Code eine gute visuelle Struktur hat, siehst du sofort, was passiert. Wenn nicht, wenn du also vergisst, sauber einzurücken, oder deine Einrückung durcheinanderbringst, wird es sehr schnell verwirrend. Deshalb haben wir in diesem Kurs eine feste Regel: Die öffnende geschweifte Klammer steht immer in derselben Zeile wie die `repeat`-Anweisung (_statement_ auf Englisch). Die schließende geschweifte Klammer steht immer in einer eigenen Zeile nach der Anweisung. Und den Code dazwischen rückst du immer um zwei Leerzeichen ein. So bleibt alles schön ordentlich. Und wenn du es vergisst oder ein anderes Muster ausprobierst, bekommst du einen Fehler.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki zeigt auf die Einrückung und die neue Zeile, die den Block einer Schleife ordentlich halten"
  width="500"
  height="398"
/>
