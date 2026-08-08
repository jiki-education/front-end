---
title: "Naplemente"
description: "Animálj egy gyönyörű naplementét."
en_md5: 7c3be1e23fc2e78ff399e91c6aef0477
---

A feladatod, hogy egy naplementét animálj, ami 100 iteráción át tart. Így kell kinéznie (a villódzás pont olyan, mint amit a flipbookoknál is látsz!):

<img src="/static/images/exercise-assets/sunset/example.webp" alt="Naplemente" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 16px;" />

A kezdeti jelenetet mi rajzoltuk meg neked. Néhány dolgot kell animálnod, a legutóbbi videóban tanult flipbook-stílusban:

- **A nap mérete**: Kezdetben a sugara 5 legyen, és iterációnként 0,2-vel nőjön.
- **A nap pozíciója**: A kiinduló középpontja (50, 10), és iterációnként 1-gyel lejjebb kell kerülnie az égen.
- **A nap színe**: Animáld sárgáról narancssárgára RGB segítségével. Választhatsz bármilyen értéket, de mi azt javasoljuk, hogy kezdd `255, 237, 0`-val, és csökkentsd a zöldet a szép hatás érdekében.
- **Az ég színe**: Használd a HSL-t az ég színének animálásához. A színárnyalatot (_hue_ angolul) kell növelned az animáció során. Válassz olyan értékeket, amik szerinted jól mutatnak. Mi egy rózsaszínes naplementét választottunk a fenti animációban, de te bármilyen hangulatot választhatsz!

Ne feledd: flipbook-stílusban animálni annyit tesz, hogy egyszerűen újra megrajzolod a teljes jelenetet az előző verzió tetejére.

Sok szerencsét!
