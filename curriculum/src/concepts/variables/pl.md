---
title: "Tworzenie i używanie zmiennych"
description: "Pudełka na półkach Jikiego, które przechowują wartość opatrzoną etykietą, dzięki czemu można ją później wyjąć i wykorzystać w kodzie."
en_md5: dd0834017a8d42c22cca25966c1fdd91
---

Zmienne (ang. _variables_) pozwalają nam przechowywać informacje. Podczas pisania kodu często trzeba zachować jakąś liczbę albo string na później, i właśnie do tego służą zmienne. Spójrzmy teraz na magazyn Jikiego z szerszej perspektywy. Zobaczysz, że jest tam jeszcze jeden zestaw półek. Pierwszy zestaw już znasz: to tam stoją funkcje, czyli nasze małe maszyny, takie jak `move` czy `rectangle`. Na drugim zestawie zamiast maszyn znajdziesz pudełka. To właśnie te pudełka nazywamy zmiennymi. Możesz kazać Jikiemu schować w takim pudełku, co tylko chcesz, a później poprosić go, żeby to z niego wyjął. Podobnie jak funkcje, każde pudełko ma własną nazwę. W środku mieści się tylko jedna rzecz. Na razie będą to liczby albo stringi, ale w dalszej części kursu zobaczymy, jak przechowywać w nich bardziej złożone dane.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dwa zestawy półek w magazynie Jikiego: jeden z podpisem funkcje, na którym stoją maszyny, i drugi z podpisem zmienne, na którym stoją pudełka"
  width="500"
  height="173"
/>

Jak więc powiedzieć Jikiemu, żeby stworzył pudełko i coś do niego włożył? Używamy do tego słowa kluczowego `let`, które daje Jikiemu znać, że ma przygotować nowe pudełko. Wyobraź sobie, jak Jiki wyjmuje kartonowe pudełko z opakowania i składa je w całość. Potem patrzy, co stoi za słowem `let`: to etykieta, którą naklei na pudełko, w tym przypadku `name` (imię). Bierze więc długopis i pisze na etykiecie `name`. Następnie sprawdza, co znajduje się za znakiem równości `=` (ang. _equal sign_). Tutaj jest to moje imię, `"Jeremy"`, a ponieważ `"Jeremy"` to string, Jiki bierze kartkę papieru i zapisuje na niej `"Jeremy"`. To zwykły string, dokładnie tak jak w przypadku kolorów, z którymi pracujesz. Na koniec Jiki wkłada tę kartkę do pudełka.

```javascript
let name = "Jeremy"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/jeremy-paper.webp"
  alt="Jiki trzyma kartkę papieru ze stringiem Jeremy, gotowy, by włożyć ją do pudełka"
  width="373"
  height="400"
/>

Poprosiliśmy go więc o przygotowanie pudełka, naklejenie etykiety i włożenie czegoś do środka. Na koniec Jiki odkłada pudełko na półkę. Od tej chwili Jiki może w dowolnym momencie podejść do półki, zdjąć to pudełko i zajrzeć do środka. Warto wyrobić sobie taki nawyk myślenia. Programuję od lat, a gdy piszę kod, wciąż wyobrażam sobie, że wkładam coś do pudełka, żeby móc to później stamtąd wyciągnąć. Kiedy więc widzisz słowo kluczowe `let`, po prostu pomyśl: „Aha, czyli przygotowuję teraz nowe pudełko”.

Kilka słów o nazwach zmiennych, czyli o etykietach na tych pudełkach. Obowiązuje tu parę zasad. Po pierwsze, nazwy zmiennych nie mogą zawierać spacji. Jeśli chcesz, żeby etykieta pudełka składała się z kilku słów, połącz je ze sobą, a pierwszą literę każdego kolejnego słowa zapisz wielką literą. Nazywamy to camel case. Aby łatwiej to zapamiętać, wyobraź sobie wielbłąda, którego garby wypychają w górę pierwszą literę każdego kolejnego słowa. Jeśli etykieta ma oznaczać „moje imię”, łączymy oba słowa w jedno i zapisujemy je jako `myName`, z wielką literą N na początku drugiego słowa.

Poza tym każda zmienna musi mieć unikalną nazwę. Nie mogą istnieć dwa pudełka z tą samą etykietą, a zmienna nie może też nazywać się tak samo jak funkcja. Jeśli o tym zapomnisz, Jiki się pogubi i zwróci komunikat o błędzie.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki patrzy zdezorientowany na dwa pudełka, które mają tę samą etykietę name"
  width="485"
  height="400"
/>

Zobaczmy teraz, gdzie zmienna może się przydać. Powiedzmy, że rysujemy słońce na niebie. Wiemy już, że można użyć funkcji `circle` (okrąg) i przekazać jej cztery dane wejściowe: `left` (od lewej), `top` (od góry), `radius` (promień) i `color` (kolor). Ale gdy dodajemy kolejne elementy, a liczby są porozrzucane po całym kodzie, szybko robi się w nim bałagan i staje się on nieczytelny. Zamiast tego możemy więc utworzyć osobne zmienne dla pozycji od lewej, pozycji od góry, dla `radius` i dla `color`, a potem się do nich odwoływać. Naszym celem jest więc wywołanie funkcji `circle` z ładnymi, czytelnymi nazwami pudełek. Kiedy Jiki zobaczy te nazwy, będzie wiedział, że ma zdjąć pudełka z półek i użyć tego, co jest w środku.

Utwórzmy więc te zmienne. Zaczynamy od pozycji słońca w poziomie. Słowem kluczowym `let` mówimy Jikiemu, żeby utworzył nowe pudełko o nazwie `leftPosition` (pozycja od lewej). Zwróć uwagę na camel case i wielkie P. Mówimy też Jikiemu, jaka liczba trafia do pudełka. Jiki odkłada je na półki, a potem robi to samo dla `topPosition` (pozycja od góry), `radius` i `color`.

```javascript
let leftPosition = 10
let topPosition = 20
let radius = 5
let color = "yellow"

circle(leftPosition, topPosition, radius, color)
```

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/name-on-shelf.webp"
  alt="Podpisane pudełka na półkach ze zmiennymi, każde przechowuje jedną wartość, po którą Jiki może później sięgnąć"
  width="500"
  height="378"
/>

W dowolnym miejscu w kodzie możemy odwołać się do tych zmiennych, a Jiki wyjmie z nich przechowywane wartości (ang. _values_) i włoży je do maszyny. Zmienne mają jeszcze jedną wielką zaletę: kiedy tylko chcemy narysować coś w tym samym miejscu co słońce, możemy ponownie użyć tych samych zmiennych `leftPosition` i `topPosition`. Weźmy inny przykład. Wyobraź sobie, że budujesz mur z 30 cegieł i chcesz, żeby wszystkie cegły miały tę samą szerokość i wysokość. O wiele lepiej jest na początku kodu utworzyć zmienne dla szerokości i wysokości, a potem odwoływać się do nich w dalszej części. Bo jeśli zechcesz później zmienić szerokość albo wysokość, wystarczy zrobić to w jednym miejscu, a cała reszta zaktualizuje się sama.
