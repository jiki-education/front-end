---
title: "Tworzenie i używanie zmiennych"
description: "Pudełka na półkach Jikiego, które przechowują wartość opatrzoną etykietą, dzięki czemu można ją później wyjąć i wykorzystać w kodzie."
en_md5: 6fca9aed7a4f51de337288e739f8b44a
---

Zmienne (ang. _variables_) pozwalają nam przechowywać informacje. Podczas pisania kodu często trzeba zachować jakąś liczbę albo jakiś string na później, i właśnie do tego służą zmienne. Spójrzmy więc na magazyn Jikiego z nieco szerszej perspektywy, a zobaczysz, że stoi w nim jeszcze jeden zestaw półek. Pierwszy zestaw już znasz: to na nim leżą funkcje, te małe maszyny takie jak `move` czy `rectangle`. Na tym drugim zestawie półek zamiast maszyn widać za to mnóstwo pudełek, i to właśnie te pudełka nazywamy zmiennymi. Możesz kazać Jikiemu schować w takim pudełku, co tylko chcesz, a później poprosić go, żeby to z niego wyjął. Każde pudełko ma nazwę, dokładnie tak samo jak funkcje, i każde mieści tylko jedną rzecz. Na razie będzie to liczba albo string, ale w dalszej części kursu zobaczymy, jak przechowywać w nich rzeczy bardziej złożone.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/two-shelves.webp"
  alt="Dwa zestawy półek w magazynie Jikiego: jeden z podpisem funkcje, na którym stoją maszyny, i drugi z podpisem zmienne, na którym stoją pudełka"
  width="500"
  height="173"
/>

Jak więc powiedzieć Jikiemu, żeby zrobił pudełko i coś do niego włożył? Używamy do tego słowa kluczowego `let` (niech). Słowo `let` mówi Jikiemu, że ma przygotować nowe pudełko. Wyobraź sobie, jak wyjmuje kartonowe pudełko z opakowania i składa je w całość. Potem patrzy, co stoi za słowem `let`: to etykieta, którą naklei na pudełko, w tym przypadku `name` (imię). Bierze więc długopis i pisze na etykiecie `name`. Następnie sprawdza, co znajduje się za znakiem równości (ang. _equal sign_). Tutaj jest to moje imię, `"Jeremy"`, a ponieważ `"Jeremy"` to string, Jiki bierze kartkę papieru i zapisuje na niej `"Jeremy"`. To zwykły string, dokładnie taki sam jak kolory, z którymi pracujesz. Na koniec Jiki wkłada tę kartkę do pudełka.

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

Kazaliśmy mu więc zrobić pudełko, nakleić etykietę i coś do środka włożyć, a on odnosi teraz pudełko na półkę. Od tej chwili w dowolnym miejscu programu Jiki może podejść do półki, zdjąć to pudełko i zajrzeć do środka. Zacznij budować sobie ten model mentalny. Programuję od zawsze, a pisząc kod, wciąż wyobrażam sobie, że wkładam coś do pudełka, żeby później to wyjąć. Kiedy widzisz słowo kluczowe `let`, naprawdę pomyśl: „Aha, czyli robię nowe pudełko”.

Kilka słów o nazwach zmiennych, czyli o etykietach na tych pudełkach. Obowiązuje tu parę zasad. Po pierwsze, nazwy zmiennych nie mogą zawierać spacji. Jeśli chcesz, żeby etykieta pudełka składała się z kilku słów, sklejamy je ze sobą, a pierwszą literę każdego kolejnego słowa zapisujemy wielką literą. Nazywamy to camel case. Wyobraź sobie wielbłąda, którego garby wypychają w górę pierwszą literę każdego nowego słowa. Jeśli więc etykieta ma znaczyć „moje imię”, to zamiast dwóch słów ze spacją piszemy jedno słowo z wielkim N: `myName`.

Poza tym każda nazwa zmiennej musi być niepowtarzalna. Nie mogą istnieć dwa pudełka z tą samą etykietą, a zmienna nie może też nazywać się tak samo jak funkcja. Jeśli o tym zapomnisz, Jiki się pogubi i zwróci komunikat o błędzie.

<img
  class="concept-image"
  src="/static/images/concept-assets/variables/duplicate-names-confused.webp"
  alt="Jiki patrzy zdezorientowany na dwa pudełka, które mają tę samą etykietę name"
  width="485"
  height="400"
/>

Zobaczmy teraz, gdzie zmienna może się przydać. Powiedzmy, że rysujemy słońce na niebie. Wiemy już, że można użyć funkcji `circle` (okrąg) i przekazać jej cztery dane wejściowe: `left` (od lewej), `top` (od góry), `radius` (promień) i `color` (kolor). Ale gdy rysujemy dużo rzeczy, a te wszystkie liczby są porozrzucane po całym kodzie, robi się on naprawdę trudny do czytania i ogarnięcia. Zamiast tego możemy więc utworzyć osobne zmienne dla pozycji od lewej, pozycji od góry, dla `radius` i dla `color`, a potem się do nich odwoływać. Naszym celem jest więc wywołanie funkcji `circle` z ładnymi, czytelnymi nazwami pudełek. Kiedy Jiki zobaczy te nazwy, będzie wiedział, że ma zdjąć pudełka z półek i użyć tego, co jest w środku.

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

W dowolnym miejscu kodu możemy odwołać się do tych zmiennych, a Jiki wyjmie z nich wartości (ang. _values_) i włoży je do maszyny. Zmienne mają jeszcze jedną wielką zaletę: kiedy tylko chcemy narysować coś w tym samym miejscu co słońce, możemy ponownie użyć tych samych zmiennych `leftPosition` i `topPosition`. Weźmy inny przykład. Wyobraź sobie, że budujesz mur z 30 cegieł i chcesz, żeby wszystkie cegły miały tę samą szerokość i wysokość. O wiele lepiej jest na początku kodu utworzyć zmienne dla szerokości i wysokości, a potem odwoływać się do nich w dalszej części. Bo jeśli zechcesz później zmienić szerokość albo wysokość, wystarczy zrobić to w jednym miejscu, a cała reszta zaktualizuje się sama.
