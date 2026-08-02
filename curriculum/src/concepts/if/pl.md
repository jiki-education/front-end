---
title: "Instrukcje warunkowe"
description: "Jak za pomocą słowa kluczowego `if` uruchomić blok kodu tylko wtedy, gdy warunek jest prawdziwy, zupełnie jak ochroniarz wpuszczający gości do środka."
en_md5: 8797e078e1ad90b7652373baf6f96f28
---

Istnieje słowo kluczowe, dzięki któremu możemy powiedzieć Jikiemu, żeby robił coś tylko w określonych sytuacjach. Wyobraź sobie, że piszesz kod pilnujący wejścia do baru: jesteś ochroniarzem, a Jiki ma otwierać drzwi tylko wtedy, gdy ktoś jest odpowiednio ubrany. Albo że na mecie wyścigu odpowiadasz za machnięcie flagą w szachownicę, ale Jiki musi wiedzieć, że robi się to dopiero na ostatnim okrążeniu. Właśnie w takich sytuacjach przyda się słowo kluczowe `if`.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bar-door-scenario.webp"
  alt="Jiki jako ochroniarz decydujący, kogo wpuścić do klubu nocnego"
  width="292"
  height="400"
/>

<img
  class="concept-image"
  src="/static/images/concept-assets/if/waving-flag.webp"
  alt="Jiki gotowy do machnięcia flagą w szachownicę na mecie wyścigu"
  width="266"
  height="400"
/>

Słowa kluczowego `if` używamy bardzo podobnie jak `repeat`. W zwykłych nawiasach umieszczamy pewną informację; w tym przypadku jest to warunek, który sprawdzamy. A potem w nawiasach klamrowych zapisujemy blok kodu, który wykona się tylko wtedy, gdy ten warunek jest prawdziwy.

```javascript
if (condition) {
}
```

Jak więc wyglądają takie warunki? Zazwyczaj jest to jakieś porównanie: porównujemy dwie liczby albo dwa stringi i sprawdzamy, czy wynik jest prawdziwy, czy fałszywy.

Pomyśl o nich jak o zdaniach (ang. _statement_), które można wypowiedzieć na głos. Trzy jest mniejsze niż pięć. To prawda. Siedem jest mniejsze niż dwa. To fałsz.

Do zapisywania porównań używamy symboli, które najpewniej znasz już z matematyki. Mamy „mniejsze niż”, „większe niż”, „mniejsze lub równe”, „większe lub równe”, a do tego sprawdzenie, czy dwie rzeczy są takie same, czyli sobie równe. Ten ostatni zapis trochę różni się od tego, co zwykle widuje się na matematyce, bo żeby sprawdzić, czy dwie rzeczy są takie same, czy różne, piszemy trzy znaki równości z rzędu.

<img
  class="concept-image"
  src="/static/images/concept-assets/if/comparisons-symbols.webp"
  alt="Tabela operatorów porównania: mniejszy niż, większy niż, mniejszy lub równy, większy lub równy, równy i różny, wraz z przykładami"
  width="449"
  height="400"
/>

Dzięki temu nic nam się nie pomyli, kiedy ustawiamy lub zmieniamy wartość zmiennej, bo tam pojedynczy znak równości oznacza „włóż to do pudełka”. Zapamiętaj po prostu: trzy znaki równości służą do porównywania.

Porównywać można też stringi. `"hello"` równa się `"hello"`: to prawda, oba stringi są takie same. Ale tu uwaga, bo Jiki porównuje każdy pojedynczy znak (ang. _character_) w obu stringach, na obu kartkach papieru. Dlatego `"Hello"` przez wielkie H nie jest równe `"hello"` przez małe h: to różne stringi. Takie porównanie dałoby fałsz, bo wielkie H i małe h to różne znaki.

A tak przy okazji: prawda i fałsz noszą wspólną nazwę wartości logicznych (ang. _Boolean_). To kolejne słowo, które brzmi technicznie, ale sprawa jest naprawdę prosta: to po prostu formalny sposób powiedzenia, że coś jest albo prawdą, albo fałszem. Jeśli więc gdzieś natkniesz się na słowo „Boolean”, oznacza ono właśnie prawdę lub fałsz. Zobaczmy to w akcji. Wyobraźmy sobie, że budujemy takiego robota-ochroniarza dla klubu i ustalamy, że ma otwierać drzwi tylko osobom, które mają co najmniej 21 lat. Mamy więc funkcję `askAge` (zapytaj o wiek), dzięki której możemy poznać czyjś wiek, a jej wynik zapisujemy w zmiennej o nazwie `age` (wiek). Potem możemy powiedzieć: jeśli `age` jest większe niż 20, otwieramy drzwi. Jeśli więc `askAge` zwróci `30`, drzwi się otworzą, a jeśli zwróci `12`, pozostaną zamknięte.

```javascript
let age = askAge()
if (age >= 21) {
  openDoor()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/if/bouncer-open-close.webp"
  alt="Jiki otwierający drzwi osobie wystarczająco dorosłej i odmawiający wejścia osobie zbyt młodej"
  width="410"
  height="400"
/>
