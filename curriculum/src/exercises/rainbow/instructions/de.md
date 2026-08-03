---
title: "Regenbogen"
description: "Male einen Regenbogen aus 100 bunten senkrechten Balken."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Deine Aufgabe ist es, ein wunderschönes Regenbogenmuster aus 100 senkrechten Balken zu malen. Es sollte so aussehen:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Regenbogen" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Der Regenbogen besteht aus `100` Balken, die jeweils von oben nach unten verlaufen und eine Breite von `1` haben. Der erste Balken sollte ein `x` (die Position von links) von `0` haben, und der letzte Balken ein `x` von `99`.

Um die Farbe festzulegen, verwende die Funktion `hsl(...)` (Farbton, Sättigung, Helligkeit). Diese gibt einen Farb-String zurück (_returns_ auf Englisch), den du dann als letzten Eingabewert für `rectangle(...)` (Rechteck) verwenden kannst. Am besten setzt du die Werte für Sättigung (_saturation_ auf Englisch) und Helligkeit (_lightness_ auf Englisch) auf ungefähr `50`. Der erste Balken sollte einen **Farbton** (_hue_ auf Englisch) von `0` haben. Der Farbton sollte mit jedem Balken größer werden und am Ende ungefähr bei 300 liegen.
