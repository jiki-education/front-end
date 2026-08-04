---
title: "Kidobó: Öltözködési szabályzat"
description: "A vendég öltözéke, életkora és vendéglistás státusza alapján döntsd el, beengedhető-e."
en_md5: 3e9f98d0b80d6bf0865cd0439005807b
---

Újra itt vagy a mellékállásodban, mint kidobó, és ma este egy olyan helyen dolgozol, ahol szigorú az öltözködési szabályzat.

Az a dolgod, hogy ellenőrizd, mit visel az illető, valamint az életkorát, és ez alapján dönts. Van néhány „érdekesebb” szabályod is, amit be kell tartanod.

### A szabályok

- **Bárkit**, aki **alkalmi** vagy **elegáns** ruhát visel, beengedünk (függetlenül attól, hogy rajta van-e a vendéglistán), és canapét kínálunk neki.
- A **felnőtteket** (18 éves vagy idősebb), akik **alkalmi** ruhát viselnek, **ezen felül** pezsgővel is kínáljuk.
- A **gyerekeket** (18 év alatt) más ruhában **csak akkor** engedjük be, ha rajta vannak a vendéglistán.
- Mindenki mást elküldünk.

Az öltözködési kategóriák:

- **Alkalmi**: `"ballgown"` vagy `"tuxedo"`
- **Elegáns**: `"suit"` vagy `"dress"`

### A képességeid

Három függvényed van az adatok lekérésére:

- `getOutfit()` (öltözet lekérése) visszaadja a viselt ruha nevét (pl. `"ballgown"`, `"suit"`, `"denim"`)
- `getAge()` (életkor lekérése) visszaadja az életkorát.
- `onGuestList()` (vendéglistán van-e) visszaadja, hogy rajta van-e a vendéglistán.

A megoldásban minden adatlekérő függvényt csak egyszer használhatsz (különben bosszantó leszel, ha folyton a nevüket kérdezed, stb.!).

Van néhány művelet, amit végrehajthatsz:

- `offerChampagne()` (pezsgőt kínál) egy pohár pezsgőt kínál az illetőnek
- `offerCanapes()` (canapét kínál) némi canapét kínál (lazactatár)
- `letIn()` (beengedi) beengedi az illetőt a helyiségbe
- `turnAway()` (elküldi) elküldi az illetőt

### Hatékony kódolás

Sokféleképpen meg lehet oldani ezt a feladatot. A célod az, hogy úgy rakd össze a szabályokat, hogy a kód **áttekinthető** legyen. Ahol lehet, kerüld a duplikációt.

Jó szórakozást és sok szerencsét!
