---
title: "Nézz körül"
description: "Készítsd el a függvényeket, amelyek megvizsgálják, mi van körülötted a labirintusban."
en_md5: 9ca44b407519cf6b3d5fa9f3f0e3b3d3
---

Legutóbb hozzáadtál egy új függvényt, ami segít eligazodni a labirintusban: `turnAround()` (fordulj meg). A kódodat a bal oldalon látod, hogy tovább dolgozhass rajta.

Ezúttal eltávolítottunk három függvényt, amelyekre korábban támaszkodtál. Ebben a feladatban a te feladatod, hogy te magad implementáld őket!

### A függvények, amelyeket meg kell írnod

A három elkészítendő függvény: `canTurnLeft()` (balra tud-e fordulni), `canTurnRight()` (jobbra tud-e fordulni) és `canMove()` (tud-e lépni).

Egyik függvénynek sincs bemenete. Mindegyik egy boolean-t adjon vissza, ami megmondja, hogy lehetséges-e abba az irányba mozogni.

Segítségül hozzáadtunk egy új `look(direction)` (nézz (irány)) függvényt. Ez a függvény egy bemenetet vár – egy irányt, ami lehet `"left"`, `"right"` vagy `"ahead"`. Az alábbiak egyikét adja vissza:

- `"start"` (Ahonnan indulsz)
- `"target"` (Ahova tartasz)
- `"empty"` (A szabad út előre!)
- `"fire"` (Vigyázz!)
- `"poop"` (Fúj)
- `"wall"` (Jaj!)

### Megjegyzések, amik segítenek

Íme három megjegyzés, ami segít.

1. Egy ilyen feladatban bevett gyakorlat, hogy **először a függvényeket hozod létre**, amelyekre a kódnak szüksége van (vagyis `canTurnLeft()`, `canTurnRight()` és `canMove()`). Állítsd be a visszatérési értéküket valamilyen ésszerű alapértékre (ebben az esetben `true` vagy `false`). Ezután implementálhatod mindegyik függvény logikáját, és minden alkalommal haladsz egy kicsit, ahelyett, hogy folyamatosan azt a hibát kapnád, hogy a függvény nem létezik, amíg meg nem írtad az egész programot.
2. **Ne kelljen megváltoztatnod semmit a meglévő kódból** ennél a feladatnál. Ehelyett add hozzá a három függvényt a kód elejéhez.
3. Írhatsz **több függvényt** is, nem csak a szükségeseket, ha ez segít.
