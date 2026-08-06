---
title: "Prugasta tkanina"
description: "Ispleti prugasti uzorak tako što pravilno odabereš boju svake pruge."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Osmišljavaš algoritam za kreiranje rolne prugaste tkanine, koja bi trebalo da izgleda ovako:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Dvadeset vertikalnih pruga: ljubičasta na oba kraja, sa zelenim, plavim i žutim prugama između" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
  <rect x="0" y="0" width="5" height="100" fill="#A020F0" />
  <rect x="5" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="10" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="15" y="0" width="5" height="100" fill="#008000" />
  <rect x="20" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="25" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="30" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="35" y="0" width="5" height="100" fill="#008000" />
  <rect x="40" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="45" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="50" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="55" y="0" width="5" height="100" fill="#008000" />
  <rect x="60" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="65" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="70" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="75" y="0" width="5" height="100" fill="#008000" />
  <rect x="80" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="85" y="0" width="5" height="100" fill="#56AEFF" />
  <rect x="90" y="0" width="5" height="100" fill="#ffed06" />
  <rect x="95" y="0" width="5" height="100" fill="#A020F0" />
</svg>

Uzorak je ponavljajući niz `"yellow"`, `"blue"`, `"yellow"`, `"green"`. Prva i poslednja pruga su `"purple"`.

Platno na kome dizajniraš je širine `100` i visine `100`. Potrebno je da nacrtaš `20` pruga, svaka širine `5`.

### Pravila vežbe

Ne možeš da rešiš ovu vežbu tako što ćeš samo napisati 20 naredbi za pravougaonik. Tvoj kod treba da može da se prilagodi bilo kojoj veličini tkanine. Zapravo, funkciju `rectangle(...)` (pravougaonik) smeš da upotrebiš samo jednom u svom kodu!

Umesto toga, treba da napraviš petlju i iskoristiš operator ostatka (engl. _remainder_) koji smo videli u poslednjoj video lekciji. Pažljivo razmisli o redosledu naredbi. To je ključ uspeha u ovoj vežbi.

Ne žuri i zabavi se!
