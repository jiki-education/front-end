---
title: "Arc-en-ciel"
description: "Peins un arc-en-ciel composé de 100 barres verticales colorées."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Ta mission est de créer un magnifique motif d'arc-en-ciel composé de 100 barres verticales. Il devrait ressembler à ceci :

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Arc-en-ciel" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

L'arc-en-ciel est composé de `100` barres, qui vont chacune de haut en bas avec une largeur de `1`. La première barre doit avoir un `x` (position horizontale) de `0`, et la dernière un `x` de `99`.

Pour définir la couleur, utilise la fonction `hsl(...)` (teinte, saturation, luminosité). Elle renvoie (_returns_ en anglais) une string de couleur que tu peux ensuite utiliser comme dernier argument de `rectangle(...)`. Le mieux est sans doute de régler la saturation et la luminosité (_lightness_ en anglais) autour de `50`. La première barre doit avoir une **teinte** (_hue_ en anglais) de `0`. La teinte doit augmenter à chaque barre, pour finir aux alentours de 300.
