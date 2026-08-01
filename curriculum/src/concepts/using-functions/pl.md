---
title: "Używanie funkcji"
description: "Jak kazać Jikiemu uruchomić jedną z jego małych maszyn: wpisz jej nazwę, a zaraz po niej dwa nawiasy."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Pisanie kodu to tak naprawdę przekazywanie komputerowi, co ma się stać, w języku, który on rozumie. Języków programowania jest wiele, podobnie jak interpreterów, które biorą to, co napiszesz, i zamieniają je na zera i jedynki zrozumiałe dla komputera. W tym kursie Twoim interpreterem jest Jiki. To od niego cały kurs wziął swoją nazwę. Oto Jiki. Jiki będzie Twoim przyjacielem w tej programistycznej podróży. Jego zadaniem jest interpretowanie kodu, który piszesz, i zamienianie go na zera i jedynki, na które komputer potrafi już zareagować.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, przyjazny interpreter, który poprowadzi Cię przez ten kurs"
  width="421"
  height="400"
/>

W programowaniu chodzi o jedno: o dawanie interpreterowi, czyli w tym przypadku Jikiemu, właściwych instrukcji. A instrukcji, które Jiki rozumie, jest naprawdę mnóstwo. Potrafi sklejać różne rzeczy ze sobą, potrafi powtórzyć coś wiele razy, umie stwierdzić: „Jeśli wydarzy się to, muszę zrobić tamto”. Potrafi też coś zapamiętać i sięgnąć po to później, a gdy coś jest nie tak, zgłosi błąd. Wszystkim tym zajmiemy się w trakcie kursu. Najważniejsze jest jednak jedno: cokolwiek będziesz robić, zawsze sprowadza się to do zapisywania w notatniku instrukcji, które Jiki następnie przychodzi wykonać.

Kiedy 34 lata temu uczyłem się programować, zbudowałem sobie dokładnie taki model mentalny i mam go w głowie do dziś. Wiem, jak komputer działa na samym dole, na poziomie zer i jedynek, ale szczerze mówiąc, w ogóle o tym nie myślę. W mojej głowie w komputerze mieszka mały człowieczek, a ja mówię mu, co ma robić. Spróbuj spojrzeć na to tak samo. To potężny model mentalny, a jeśli zaczniesz w ten obrazowy sposób wyobrażać sobie, co robi człowieczek w komputerze, bardzo Ci to pomoże w dalszej nauce programowania.

Zacznijmy więc od jednego z podstawowych pojęć programowania, czyli od funkcji (ang. _functions_). Funkcje przypominają małe maszyny, których Jiki używa, kiedy mu każesz. A gdy zajrzymy do magazynu Jikiego, bo to właśnie tam przesiaduje, zobaczysz, że na półce stoją trzy różne maszyny: `move` (ruch), `turnLeft` (skręt w lewo) i `turnRight` (skręt w prawo).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Półka w magazynie Jikiego z trzema maszynami opisanymi move, turnLeft i turnRight"
  width="500"
  height="371"
/>

Wpisując `move`, a zaraz po nim te dwa nawiasy, mówisz Jikiemu, żeby zdjął z półki maszynę `move`, zakręcił korbą, uruchomił ją i jej użył.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki zdejmuje maszynę move z półki, żeby jej użyć"
  width="439"
  height="400"
/>

Podobnie z `turnLeft`: wpisując jego nazwę i nawiasy, każesz Jikiemu zdjąć z półki maszynę `turnLeft` i jej użyć. I właśnie ten schemat będzie Ci towarzyszyć na każdym kroku. Zawsze, gdy chcesz użyć jakiejś maszyny, wpisujesz jej nazwę, a po niej te nawiasy. Dla Jikiego to znak, że ma przynieść maszynę i jej użyć:

```javascript
move()
turnLeft()
```

Tym, jak taka maszyna właściwie działa i co dzieje się w jej środku, nie musimy się na razie przejmować. Przyjrzymy się temu dużo dokładniej później. Zresztą już niedługo nauczysz się budować własne maszyny. Na razie jednak zostawmy ten temat. W każdym ćwiczeniu dowiesz się, które maszyny stoją na półce Jikiego. Za każdym razem będą to inne maszyny i to właśnie za ich pomocą rozwiążesz kolejne zadania.
