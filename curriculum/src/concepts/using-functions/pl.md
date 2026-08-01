---
title: "Używanie funkcji"
description: "Powiedz Jikiemu, żeby uruchomił jedną ze swoich małych maszyn: wpisz jej nazwę, a po niej dwa nawiasy."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Kiedy piszesz kod, w rzeczywistości mówisz w języku zrozumiałym dla komputera, co ma się stać. Istnieje wiele różnych języków programowania i wiele różnych interpreterów, które biorą to, co piszesz, i zamieniają na zera i jedynki zrozumiałe dla komputera. W tym kursie Twoim interpreterem jest Jiki. Cały kurs wziął nazwę od Jikiego. Oto Jiki. Jiki będzie Twoim przyjacielem w tej programistycznej podróży. Jego zadaniem jest interpretowanie kodu, który piszesz, i zamiana go na zera i jedynki, na które komputer potrafi już zareagować.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, przyjazny interpreter, który poprowadzi Cię przez ten kurs"
  width="421"
  height="400"
/>

Cały sens programowania polega na tym, żeby dawać interpreterowi, w tym przypadku Jikiemu, właściwe instrukcje. A instrukcji, które możesz dać Jikiemu, jest naprawdę wiele, bo rozumie on bardzo dużo. Potrafi skleić różne rzeczy ze sobą, potrafi zrobić coś wiele razy, potrafi powiedzieć: „Jeśli stanie się to, muszę zrobić tamto”. Potrafi zapamiętać różne rzeczy i użyć ich później. Jeśli coś jest nie tak, potrafi zgłosić błąd. Wszystkim tym zajmiemy się w trakcie kursu. Najważniejsze jednak, żeby zrozumieć jedno: wszystko, co będziesz robić, polega na tym, że wypisujesz instrukcje w notatniku, a Jiki przychodzi i je wykonuje.

Kiedy 34 lata temu uczyłem się programować, zbudowałem sobie właśnie taki model mentalny i mam go w głowie do dziś. Rozumiem, jak działają komputery, aż do poziomu zer i jedynek, ale szczerze mówiąc, nigdy o tym nie myślę. W mojej głowie w komputerze mieszka mały człowieczek, któremu mówię, co ma robić. Więc spróbuj popatrzeć na to tak samo. To potężny model mentalny, który możesz sobie zbudować, a jeśli zaczniesz myśleć w ten bardzo obrazowy sposób o tym, co robi ten człowieczek w komputerze, bardzo Ci to pomoże w nauce programowania.

Zacznijmy więc od jednego z podstawowych pojęć w programowaniu, czyli od funkcji (ang. _functions_). Funkcje są jak małe maszyny, których Jiki użyje, gdy mu o tym powiesz. A jeśli zajrzymy do magazynu Jikiego, bo właśnie tam przesiaduje, zobaczysz, że ma tam półkę z trzema różnymi maszynami: `move` (ruch), `turnLeft` (skręt w lewo) i `turnRight` (skręt w prawo).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Półka w magazynie Jikiego z trzema maszynami opisanymi move, turnLeft i turnRight"
  width="500"
  height="371"
/>

Kiedy wpisujesz `move`, a po nim te dwa nawiasy, mówisz Jikiemu, żeby zdjął maszynę `move` z półki, zakręcił korbą, uruchomił ją i jej użył.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki zdejmuje maszynę move z półki, żeby jej użyć"
  width="439"
  height="400"
/>

Kiedy wpisujesz `turnLeft`, a po nim nawiasy, mówisz Jikiemu, żeby zdjął z półki maszynę `turnLeft` i jej użył. I właśnie ten schemat będziesz stosować w kółko. Zawsze gdy chcesz użyć jakiejś maszyny, wpisujesz jej nazwę, a po niej te nawiasy, i to mówi Jikiemu, żeby przyniósł maszynę i jej użył:

```javascript
move()
turnLeft()
```

A jak ta maszyna właściwie działa i co dzieje się w jej środku, tym na razie nie musimy się przejmować. Przyjrzymy się temu dużo dokładniej później. Co więcej, już niedługo nauczysz się budować własne maszyny. Na razie jednak się tym nie przejmuj. W każdym ćwiczeniu dowiesz się, jakie maszyny stoją na półce Jikiego. W każdym będą inne, a użyjesz ich do rozwiązania zadania.
