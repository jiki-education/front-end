---
title: "Petlja `while`"
description: "Petlja koja se izvršava sve dok je neki uslov tačan."
en_md5: daef89c6551b1d1cbc0e58668fd368bc
---

Sledeća petlja koju treba da upoznaš je `while` petlja (`while` znači „dok“).

Ona kaže: „Dok važi neki uslov, izvršavaj petlju.“ Recimo da imamo pravilo da u igri Space Invaders možeš da pucaš samo pet puta. Onda bismo ovde imali petlju koja kaže: dok je broj hitaca manji od pet, izvršavaj petlju koja igraču omogućava da igra igru.

```javascript
while (numShots < 5) {
  // shoot alien
  numShots++
}
```

Svaki put kada neko puca, uvećamo `numShots` za jedan, i na kraju ćemo stići do pet i petlja će se završiti.

E sad, jedan problem sa `while` petljama je to što je prilično lako napraviti bugove zbog kojih se petlja nikada ne završi. Takve petlje zovemo beskonačne petlje (engl. _infinite loops_) i one su jedan od najčešćih bugova u programima.

Kada ti se računar uspori, ventilatori počnu da se vrte i sve postane glasno, to je često zato što je neko u svom kodu ostavio beskonačnu petlju koja se nikada ne završava.
