---
title: "Tęcza"
description: "Namaluj tęczę ze 100 kolorowych pionowych pasków."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Twoim zadaniem jest namalowanie pięknej tęczy złożonej ze 100 pionowych pasków. Powinna wyglądać tak:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Tęcza" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Tęcza składa się ze `100` pasków, z których każdy biegnie od góry do dołu i ma szerokość `1`. Pierwszy pasek powinien mieć `x` (współrzędna pozioma) równe `0`, a ostatni `x` równe `99`.

Aby ustawić kolor, użyj funkcji `hsl(...)` (odcień, nasycenie, jasność). Funkcja ta zwraca (ang. _return_) kolor jako string, który możesz następnie przekazać jako ostatnią daną wejściową do funkcji `rectangle(...)` (prostokąt). Nasycenie (ang. _saturation_) i jasność (ang. _lightness_) najlepiej ustawić w okolicach `50`. Pierwszy pasek powinien mieć **odcień** (ang. _hue_) równy `0`. Z każdym kolejnym paskiem odcień powinien rosnąć, aż na końcu osiągnie wartość w okolicach 300.
