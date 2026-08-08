---
title: "Duga"
description: "Naslikaj dugu od 100 raznobojnih uspravnih traka."
en_md5: 18cf1d57b1f3683a4484b507528f9acb
---

Tvoj zadatak je da napraviš prelepu šaru u bojama duge, sastavljenu od 100 uspravnih traka. Trebalo bi da izgleda ovako:

<img src="/static/images/exercise-assets/rainbow/example.webp" alt="Duga" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Duga se sastoji od `100` traka, od kojih svaka ide od vrha do dna i ima širinu `1`. Prva traka treba da ima `x` (vodoravnu poziciju) `0`, a poslednja traka `x` od `99`.

Za podešavanje boje koristi funkciju `hsl(...)` (nijansa, zasićenost, osvetljenost). Ona vraća (engl. _returns_) string boje koji zatim možeš da iskoristiš kao poslednji ulaz u funkciji `rectangle(...)` (pravougaonik). Najbolje je da vrednosti zasićenosti (engl. _saturation_) i osvetljenosti (engl. _lightness_) podesiš na oko `50`. Prva traka treba da ima **nijansu** (engl. _hue_) `0`. Nijansa treba da se povećava za svaku traku i da na kraju stigne negde blizu 300.
