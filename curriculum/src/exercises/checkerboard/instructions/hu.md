---
title: "Dámatábla"
description: "Rajzolj egy tetszőleges méretű dámatáblát, és készítsd elő a bábukat egy játékra, minden pozíciót a tábla méretéből származtatva."
en_md5: 1669c45c882ce94e16651bfc2d77a172
---

Ebben a projektben egy dámatáblát rajzolsz, és elhelyezed rajta a bábukat, előkészítve egy dáma (vagy angolul checkers) játékot.

A kódodnak **bármilyen táblaméretre** működnie kell. Három mintatáblát adtunk neked kipróbálásra. Az egyik feladvány a klasszikus 8×8-as táblát használja, a másik egy kisebb 6×6-ost, a harmadik egy nagyobb 10×10-est. A `getBoardSize()` (táblaméret lekérése) segítségével megtudhatod, hogy hány négyzet széles és magas a tábla éppen (a táblák mindig négyzet alakúak).

<div style="display: flex; gap: 8px; margin: 12px 0;">
  <img src="/static/images/exercise-assets/checkerboard/board-6.svg" alt="6×6-os dámatábla" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-8.svg" alt="8×8-os dámatábla" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
  <img src="/static/images/exercise-assets/checkerboard/board-10.svg" alt="10×10-os dámatábla" style="width: 33.333%; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);" />
</div>

### A tábla

Ahogy szoktuk, a vászon mindig `100` széles és `100` magas. Kövesd ezt a két szabályt:

- A tábla szélén egy `"black"` színű, `2` vastagságú szegély fut körbe.
- A négyzetek felváltva `"dark brown"` és `"white"` színűek legyenek, egyenletesen kitöltve a szegélyen belüli területet. A bal alsó négyzet mindig dark brown, és nem white.

### A bábuk

- Minden bábu egy négyzet közepén helyezkedik el.
- A bábuk bordázott körök, külső peremmel és belső színnel:
  - A teljes bábu szélessége a négyzet szélességének 80%-a.
  - A belső kör szélessége a teljes bábu szélességének 75%-a.
- A tábla **tetején** lévő sorok `"charcoal"` színű bábukat kapnak (mindegyik `"black"` peremmel).
- A tábla **alján** lévő sorok `"white"` színű bábukat kapnak (mindegyik `"grey"` peremmel).
- A bábuk kizárólag a **sötét** négyzeteken állnak.
- A **középső két sor** mindig üresen marad. Az összes többi sorban vannak bábuk.

## Gondolkodj arányokban

Ennek a feladatnak a lényege, hogy **soha ne égetj be** méreteket és pozíciókat. Számold ki egyetlen cella méretét a tábla méretéből, majd ebből építsd fel az összes négyzetet és bábut. Ha jól csinálod, ugyanaz a kód egy kis 6×6-os táblát és egy nagyobb 10×10-est is kirajzol, anélkül hogy egyetlen számot is át kellene írnod.
