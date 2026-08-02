---
title: "Stringi"
description: "Fragmenty tekstu ujęte w cudzysłów (litera, słowo, zdanie albo cały akapit), które Jiki zapisuje na papierze."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Kiedy chcesz użyć liczby, możesz ją po prostu zapisać i Jiki wie, o co Ci chodzi. Ale co, jeśli chcesz użyć litery, słowa albo zdania? Na przykład: co by było, gdyby funkcja `rectangle` (prostokąt) albo funkcja `circle` (okrąg) miała dodatkowy otwór wejściowy, w którym podaje się kolor? Jak zapisać taki kolor, żeby włożyć go do maszyny? Jeśli po prostu napiszemy słowo `green` (zielony) albo `blue` (niebieski), Jiki pomyśli, że chodzi nam o maszynę stojącą na półkach, i powie: „Nie ma żadnej maszyny o nazwie green. Nie wiem, co mam zrobić”.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki stoi zdezorientowany obok maszyny rectangle, a nad jego głową unoszą się znaki zapytania"
  width="446"
  height="400"
/>

Mamy więc zasadę: zawsze, kiedy potrzebujemy użyć tekstu, ujmujemy go w cudzysłów, i to w podwójny cudzysłów. A kiedy coś zostaje ujęte w cudzysłów w ten sposób, Jiki wyciąga kartkę papieru i zapisuje na niej dokładnie to, co znalazło się między znakami cudzysłowu. Takie kartki papieru nazywamy _stringami_ (czyli ciągami znaków).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki zapisuje słowo green na kartce papieru, która staje się stringiem"
  width="398"
  height="400"
/>

Stringi mogą być pojedynczymi literami, słowami, zdaniami, akapitami, a nawet całymi książkami. Zasada jest prosta: jeśli to tekst, ujmujemy go w cudzysłów i staje się stringiem.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Notatnik z przykładami stringów różnej długości w cudzysłowach: pojedyncza litera, słowo, zdanie i kilkulinijkowy adres"
  width="500"
  height="398"
/>

Jeśli więc chcemy mieć niebieski prostokąt, zapisujemy liczby: pozycję od lewej, pozycję od góry, szerokość i wysokość. A jako piąte dane wejściowe zapiszemy `"blue"`, w cudzysłowie.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki zdejmie maszynę z półki i włoży monety do pierwszych czterech otworów. Potem napisze na kartce papieru słowo blue, włoży tę kartkę do piątego otworu i uruchomi maszynę.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki wkłada kartkę z napisem blue do piątego otworu maszyny rectangle; w pierwszych czterech otworach są monety 10, 20, 30 i 40"
  width="500"
  height="392"
/>

String to jedno z tych technicznych słów, które na początku mogą trochę onieśmielać, ale tak naprawdę oznacza po prostu tekst. Szybko się do niego przyzwyczaisz. Nie ma w nim nic magicznego.
