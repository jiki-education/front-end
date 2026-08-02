---
title: "Symbole pogodowe"
description: "Narysuj sześciodniową prognozę pogody na podstawie tablicy opisów."
en_md5: 18bc1bf16ffc94d81bfa81a93faa9a7f
---

Poproszono Cię o przygotowanie sześciodniowej prognozy pogody. Zamiast tradycyjnych danych pogodowych szef przekazuje Ci jednak opisy pogody oparte na tym, jak on ją odbiera (np. "Snowboarding time! 🏂" albo "Miserable 😩").

Dostajesz tablicę (ang. _Array_) sześciu opisów pogody, po jednym na każdy dzień, a Twoim zadaniem jest narysowanie pogody każdego dnia w osobnym polu.

Prognoza ma postać siatki sześciu pól, po jednym na każdy dzień tygodnia od poniedziałku do soboty. Opisy ułożone są po kolei: pierwszy (pole `0`) to pogoda na poniedziałek, drugi (pole `1`) na wtorek i tak dalej, aż do soboty (pole `5`). (Szef nie wychodzi z domu w niedziele, więc pogoda wtedy go nie obchodzi, a my nigdy nie możemy jej podać...)

## Rysowanie dnia

Dostajesz od nas funkcję `draw` (rysuj), która wykonuje za Ciebie całą pracę graficzną. Twoim zadaniem jest ustalić, które elementy powinny znaleźć się w środku.

```js
draw(box, day, elements)
```

- `box` to numer pola, w którym rysujesz (od `0` do `5`).
- `day` to nazwa dnia tygodnia, którą pole ma być podpisane, na przykład `"Monday"`.
- `elements` to tablica symboli pogodowych do pokazania (szczegóły poniżej).

Dni tygodnia, w kolejności, to `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"` i `"Saturday"`.

Jeśli więc pierwszy dzień to `"Exciting 🤩"`, napisz:

```js
draw(0, "Monday", ["cloud", "snow"])
```

## Co oznacza każdy opis

Każdy opis odpowiada konkretnej tablicy symboli:

- `"Sunny ☀️"`: `["sun"]`
- `"Dull 😴"`: `["cloud"]`
- `"Miserable 😩"`: `["cloud", "rain"]`
- `"Hopeful 🤞"`: `["sun", "cloud"]`
- `"Rainbow territory! 🌈"`: `["sun", "cloud", "rain"]`
- `"Exciting 🤩"`: `["cloud", "snow"]`
- `"Snowboarding time! 🏂"`: `["sun", "cloud", "snow"]`

## Twoje zadanie

Przejdź przez tablicę `days` dzień po dniu. Każdy opis zamień na właściwą tablicę symboli i za pomocą `draw` narysuj ją w polu tego dnia, podpisanym pasującą nazwą dnia tygodnia.
