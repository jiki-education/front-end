---
title: "Penguin"
description: "Završi simetričan crtež pingvina."
en_md5: bff370c28fd178d8c0ac9f65e3384e81
---

U ovoj vežbi prvi put crtamo elipse, a takođe malo više razmišljamo o simetriji koju smo pomenuli u vežbi Foxy Face.

Ova vežba koristi elipse. Elipse su kao razvučeni krugovi. I dalje određujemo tačku centra, ali umesto samo jednog poluprečnika koristimo dva: horizontalni i vertikalni poluprečnik. Ako je vertikalni poluprečnik veći od horizontalnog, elipsa će izgledati visoka. A ako je horizontalni poluprečnik veći od vertikalnog, elipsa će izgledati spljoštena. Ako oba poluprečnika postaviš na istu vrednost, opet dobijaš krug!

Funkcija `ellipse` (elipsa) prima 5 ulaza: poziciju centra (`centerX` (X koordinata centra), `centerY` (Y koordinata centra)), horizontalni poluprečnik (`radiusX` (horizontalni poluprečnik)), vertikalni poluprečnik (`radiusY` (vertikalni poluprečnik)), i boju:

<img src="/static/images/exercise-assets/penguin/intro-ellipse.webp" alt="Dijagram funkcije elipse" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

### Pingvin

Tvoj zadatak je da nacrtaš desnu stranu pingvina, i da to pokušaš da uradiš **BEZ** pomeranja miša preko koordinata ili pogađanja. Gotov crtež bi trebalo da izgleda ovako:

<img src="/static/images/exercise-assets/penguin/penguin-finished.webp" alt="Pingvin" style="width: 100%; max-width: 300px; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;" />

Polovinu slike smo nacrtali za tebe. Čitajući postojeći kod, trebalo bi da možeš da odrediš ostale detalje kako bi crtež bio simetričan. Zapamti, gornji levi ugao platna za crtanje je `0,0`. Donji desni ugao je `100,100`. Pingvin se nalazi u sredini. Za nos, treba da **promeniš** koordinate centra trougla. Ne dodaj novi trougao.

**Počni tako što ćeš pritisnuti _„Pokreni kod”_** da vidiš kako početna slika izgleda. Zabavi se!
