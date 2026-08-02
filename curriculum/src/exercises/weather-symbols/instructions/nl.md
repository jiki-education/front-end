---
title: "Weersymbolen"
description: "Teken een weersverwachting voor zes dagen op basis van een lijst met beschrijvingen."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Je bent gevraagd om een weersverwachting voor zes dagen te bouwen. Maar in plaats van traditionele weerdata krijg je van je baas beschrijvingen van het weer op basis van hoe hij zich erbij voelt (bijvoorbeeld "Snowboarding time! 🏂" of "Miserable 😩").

Je krijgt een _array_ (_reeks_) met zes weerbeschrijvingen, één per dag, en het is jouw taak om het weer van elke dag in een eigen vak te tekenen.

De weersverwachting wordt getoond als een raster van zes vakken, één voor elke weekdag van maandag tot en met zaterdag. De beschrijvingen staan op volgorde: de eerste (vak `0`) is het weer van maandag, de tweede (vak `1`) dat van dinsdag, en zo verder tot en met zaterdag (vak `5`). (Je baas komt op zondag de deur niet uit, dus dan interesseert het weer hem niet, en daarom kunnen we het nooit melden...)

## Een dag tekenen

We hebben je een functie `draw` (_tekenen_) gegeven die al het tekenwerk voor je doet. Het is aan jou om te bepalen welke elementen erin moeten.

```js
draw(box, day, elements)
```

- `box` is het vak om in te tekenen (`0` tot en met `5`).
- `day` is de weekdag waarmee het vak gelabeld wordt, bijvoorbeeld `"Monday"`.
- `elements` is een array met weersymbolen om te tonen (zie hieronder voor de details).

De weekdagen zijn, op volgorde: `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` en `"Saturday"`.

Dus als de eerste dag `"Exciting 🤩"` is, schrijf je:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Wat elke beschrijving betekent

Elke beschrijving hoort bij een specifieke array van symbolen:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Jouw taak

Werk de lijst `days` dag voor dag af. Zet elke beschrijving om in de juiste lijst met symbolen en teken die met `draw` in het vak van die dag, met de bijbehorende weekdag als label.
