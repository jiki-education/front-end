---
title: "Смугаста тканина"
description: "Витчіть смугастий візерунок, правильно обираючи колір кожної смужки."
en_md5: ba93b39f1883d50139d243a16e3c204f
---

Ми розробляємо алгоритм, який створює рулон смугастої тканини. Ось який вигляд вона має мати:

<svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Двадцять вертикальних смужок: фіолетові з обох країв, а між ними зелені, сині та жовті смужки" style="width: 200px; height: 200px; display: block; border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 5px; box-shadow: 0 0 3px rgba(0, 0, 0, 0.1); margin-bottom: 8px;padding:4px;margin-top:-8px">
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

Візерунок складається з послідовності `"yellow"`, `"blue"`, `"yellow"`, `"green"`, що повторюється. Перша й остання смужки мають колір `"purple"`.

Полотно, на якому ми працюємо, має `100` завширшки та `100` заввишки. Потрібно намалювати `20` смужок, кожна `5` завширшки.

### Правила вправи

Цю вправу не можна розвʼязати, просто написавши 20 інструкцій із прямокутниками. Наш код має працювати для тканини будь-якого розміру. Ба більше, функцію `rectangle(...)` (прямокутник) можна використати в коді лише один раз!

Натомість потрібно скористатися циклом та оператором (англ. _operator_) остачі (англ. _remainder_), який ми бачили в минулому відеоуроці. Добре подумайте про порядок інструкцій: саме від нього залежить успіх у цій вправі.

Не поспішайте й отримуйте задоволення!
