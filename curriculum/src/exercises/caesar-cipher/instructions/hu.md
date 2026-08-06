---
title: "Caesar-rejtjel"
description: "Titkos üzenet titkosítása egy ókori római rejtjel segítségével."
en_md5: 029bbd7050127405f5e67a3a20353139
---

A Caesar-rejtjel az egyik legkorábbi és legegyszerűbb titkosítási módszer. Julius Caesar használta arra, hogy titkos üzeneteket küldjön a tábornokainak.

A rejtjel úgy működik, hogy az üzenet minden betűjét egy rögzített számmal eltolja az ábécében. Például 3-as eltolásnál az 'a'-ból 'd' lesz, a 'b'-ből 'e', és így tovább. Ha az eltolás túllép a 'z'-n, akkor körbeér az ábécé elejére.

A szóközök maradjanak szóközök (nem tolódnak el).

Hozz létre egy `encode(message, shift)` (kódol(üzenet, eltolás)) nevű függvényt, amely egy kisbetűs üzenetet és egy eltolási értéket kap, és visszaadja a kódolt üzenetet.

Például:

- `encode("abc", 1)` eredménye `"bcd"`
- `encode("xyz", 3)` eredménye `"abc"` (körbeér)
- `encode("hello world", 5)` eredménye `"mjqqt btwqi"`

Tipp: Ezt a problémát érdemes kisebb segédfüggvényekre bontani!

### Véletlen tény

Egyszer egy tech-konferencia műsorvezetője voltam a portugáliai Bragában. Öt perccel azelőtt, hogy színpadra léptem volna, odajöttek hozzám a szervezők, és kissé zavartan megkérdezték, hogy nem bánnám-e, ha Julius Caesarnak öltöznék be a nap első felére, hogy megünnepeljük Braga római örökségét. Sikerült bevállalnom...?

<img
  src="/static/images/exercise-assets/caesar-cipher/jeremy-as-caesar.webp"
  alt="Jeremy Caesar jelmezben"
  style="width: 100%; max-width: 300px; border: 5px solid var(--color-purple-500); padding: 4px; border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;"
/>
