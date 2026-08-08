---
title: "Regenboog"
description: "Schilder een regenboog van 100 kleurrijke verticale balken."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Je taak is om een prachtig regenboogpatroon te maken van 100 verticale balken. Het moet er zo uitzien:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Regenboog" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

De regenboog bestaat uit `100` balken, die elk van boven naar beneden lopen en een breedte van `1` hebben. De eerste balk moet een `x` (de horizontale positie) van `0` hebben, en de laatste balk een `x` van `99`.

Om de kleur in te stellen gebruik je de functie `hsl(...)` (kleurtoon, verzadiging en helderheid). Deze functie geeft een kleurstring terug (_returns_ in het Engels), die je vervolgens als definitieve invoerwaarde in `rectangle(...)` (rechthoek) kunt gebruiken. Je kunt de verzadiging (_saturation_ in het Engels) en de helderheid (_lightness_ in het Engels) het beste op ongeveer `50` zetten. De eerste balk moet een **kleurtoon** (_hue_ in het Engels) van `0` hebben. De kleurtoon moet bij elke balk toenemen en uiteindelijk ergens in de buurt van 300 uitkomen.
