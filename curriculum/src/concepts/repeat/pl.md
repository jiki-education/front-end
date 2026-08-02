---
title: "Pętla `repeat`"
description: "Jak za pomocą słowa kluczowego `repeat` kazać Jikiemu wykonać kod w nawiasach klamrowych określoną liczbę razy."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Do tej pory cały kod był zapisywany liniowo: Jiki wykonywał instrukcje po kolei, od góry do dołu.

Teraz zobaczymy, jak Jiki może wyjść z tego sztywnego porządku, a konkretnie jak kazać mu wykonać ten sam fragment kodu wiele razy z rzędu.

Wyobraź sobie na przykład, że jesteś w labiryncie i chcesz przejść 10 kroków do przodu. Pomaga w tym funkcja `walk`, ale co, gdyby jej nie było? Gdyby do dyspozycji była tylko funkcja `move` (ruszyć się)?

Zamiast pisać `move` 10 razy z rzędu, co szybko robi się męczące, przydałby się sposób, żeby powiedzieć: „Hej, Jiki, zrób 10 razy to, co zaraz powiem.

`Move`”.

Żeby zapisać to w kodzie, sięgniemy po nasze pierwsze słowo kluczowe (ang. _keyword_). Słowa kluczowe to instrukcje, które Jiki rozumie. Wyglądają trochę jak maszyny, ale nimi nie są. Kiedy Jiki widzi słowo kluczowe, nie szuka maszyny na półce, po prostu wie, co zrobić. Ma to wbudowane w głowę. W trakcie kursu poznamy około 20 różnych słów kluczowych, a pierwszym z nich jest `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki otoczony słowami kluczowymi, takimi jak repeat, if, else, and i or, z dopiskiem, że słowa kluczowe to instrukcje, które Jiki rozumie"
  width="358"
  height="400"
/>

Słowo kluczowe `repeat` robi dokładnie to, o czym była mowa wyżej. Mówi Jikiemu: „Powtórz tyle razy to, co zaraz powiem”. Spójrz na ten kod. Najpierw używamy słowa kluczowego `repeat`, żeby zapowiedzieć Jikiemu, że będzie coś robił wielokrotnie. Potem w zwykłych nawiasach podajemy, ile razy ma to powtórzyć, a dalej stoją nawiasy klamrowe (`{}`) i to właśnie w nich zapisujemy to, co Jiki ma powtarzać. Ten wzorzec jest w programowaniu niezwykle częsty: podajemy słowo kluczowe, zwykle z jakąś dodatkową informacją (tutaj z liczbą powtórzeń), a po nim blok kodu (ang. _code block_) w nawiasach klamrowych. Wracając do świata labiryntu: zamiast pisać `move`, `move`, `move`, `move`, możemy napisać „powtórz cztery razy `move`”.

```javascript
repeat(4) {
  move()
}
```

Jiki zobaczy ten kod i użyje maszyny `move` cztery razy z rzędu.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki używający maszyny move cztery razy z rzędu, raz za razem"
  width="421"
  height="400"
/>

Nie musimy się też ograniczać do jednej rzeczy w nawiasach klamrowych. Jiki potrafi powtarzać kilka czynności. Możemy kazać mu wykonać `move`, potem `turnLeft`, i powtórzyć całość cztery razy. Kiedy Jiki zobaczy taki kod, użyje maszyny `move`, potem maszyny `turnLeft`, znów `move`, znów `turnLeft` i tak dalej, aż wykona obie czynności po cztery razy.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki używający maszyny move, a potem maszyny turnLeft, powtarzający tę parę czynności cztery razy"
  width="500"
  height="390"
/>

Takie powtarzane instrukcje nazywamy pętlami (ang. _loop_). Różnych pętli jest wiele i każda działa trochę inaczej.

Została jeszcze jedna rzecz: przy pracy z pętlami utrzymywanie kodu w porządku staje się niezbędne. Kiedy kod ma dobrą wizualną strukturę, od razu widać, co się w nim dzieje. Ale jeśli o to nie zadbasz, jeśli zapomnisz o wcięciach albo je pomieszasz, wszystko bardzo szybko robi się zagmatwane. Dlatego w tym kursie obowiązuje stała zasada. Otwierający nawias klamrowy zawsze stawiaj w tej samej linii, w której stoi instrukcja (ang. _statement_) `repeat`. Zamykający nawias klamrowy zawsze stawiaj w osobnej linii pod spodem, a kod pomiędzy nimi wcinaj o dwie spacje. Dzięki temu wszystko pozostanie czytelne, a jeśli zapomnisz albo spróbujesz innego układu, pojawi się błąd.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki wskazujący wcięcia i nową linię, dzięki którym blok kodu pętli pozostaje czytelny"
  width="500"
  height="398"
/>
