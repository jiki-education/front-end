---
title: "Funktionen verwenden"
description: "Sag Jiki, dass er eine seiner kleinen Maschinen starten soll: schreib ihren Namen und dahinter zwei runde Klammern."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Wenn du Code schreibst, teilst du eigentlich nur mit, was passieren soll, und zwar in einer Sprache, die ein Computer versteht. Es gibt viele verschiedene Programmiersprachen, und es gibt viele verschiedene Interpreter, die das nehmen, was du schreibst, und es in die Einsen und Nullen umwandeln, die ein Computer verstehen kann. In diesem Kurs ist Jiki dein Interpreter. Der ganze Kurs ist nach Jiki benannt. Das hier ist Jiki. Jiki wird dein Freund auf dieser Programmierreise sein. Seine Aufgabe ist es, den Code zu interpretieren, den du schreibst, und ihn in die Einsen und Nullen umzuwandeln, mit denen der Computer tatsächlich etwas anfangen kann.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, der freundliche Interpreter, der dich durch diesen Kurs begleitet"
  width="421"
  height="400"
/>

Beim Programmieren geht es genau darum, dem Interpreter, in diesem Fall Jiki, die richtigen Befehle zu geben. Und du kannst Jiki viele verschiedene Befehle geben, er versteht eine ganze Menge. Er kann Dinge zusammenfügen, er kann etwas ganz oft hintereinander machen, und er kann sagen: „Wenn das passiert, dann muss ich das tun.“ Er kann sich Dinge merken und sie später wieder verwenden. Und wenn etwas nicht stimmt, kann er dir einen Fehler (_error_ auf Englisch) melden. All diese Dinge schauen wir uns in diesem Kurs an. Das Wichtigste aber ist: Alles, was du machen wirst, besteht darin, Befehle auf eine Tafel zu schreiben, und Jiki kommt vorbei und befolgt sie.

Als ich vor 34 Jahren programmieren gelernt habe, habe ich mir genau dieses Denkmodell aufgebaut, und ich benutze es bis heute. Ich verstehe, wie Computer funktionieren, bis hinunter zu den Einsen und Nullen, aber ehrlich gesagt denke ich nie daran. In meiner Vorstellung lebt ein kleiner Mann im Computer, und ich sage ihm, was er tun soll. Also lass dich einfach darauf ein. Das ist ein starkes Denkmodell, das du dir aufbauen kannst. Wenn du anfängst, so bildlich darüber nachzudenken, was die Person im Computer gerade tut, wird dir das beim Lernen sehr gute Dienste leisten.

Fangen wir also mit einem der grundlegendsten Konzepte beim Programmieren an: den Funktionen (_functions_ auf Englisch). Funktionen sind wie kleine Maschinen, die Jiki auf deinen Befehl hin benutzt. Und wenn wir in Jikis Lagerhalle schauen, da hält er sich nämlich auf, dann siehst du: Er hat ein Regal mit drei verschiedenen Maschinen darauf, `move` (bewegen), `turnLeft` (nach links drehen) und `turnRight` (nach rechts drehen).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Ein Regal in Jikis Lagerhalle mit drei Maschinen: move, turnLeft und turnRight"
  width="500"
  height="371"
/>

Als du `move` und dann diese beiden runden Klammern geschrieben hast, hast du Jiki damit gesagt, dass er die `move`-Maschine vom Regal holen, die Kurbel drehen, sie anwerfen und benutzen soll.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki rollt die move-Maschine vom Regal, um sie zu benutzen"
  width="439"
  height="400"
/>

Als du `turnLeft` und dann die Klammern geschrieben hast, hast du Jiki gesagt, dass er die `turnLeft`-Maschine vom Regal holen und benutzen soll. Und genau dieses Muster wirst du immer wieder verwenden. Wann immer du eine Maschine benutzen willst, schreibst du ihren Namen und dahinter diese Klammern. Damit sagst du Jiki, dass er die Maschine holen und benutzen soll:

```javascript
move()
turnLeft()
```

Wie so eine Maschine tatsächlich funktioniert, was in ihrem Inneren passiert, darum müssen wir uns jetzt noch nicht kümmern. Das schauen wir uns später viel genauer an. Es wird sogar nicht lange dauern, bis du deine eigenen Maschinen bauen kannst. Aber im Moment: keine Sorge. Bei jeder Übung erfährst du, welche Maschinen in Jikis Regal stehen. Für jede Übung sind es andere, und mit diesen Maschinen kannst du die Übungen bearbeiten.
