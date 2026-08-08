---
title: "Petlja `repeat`"
description: "Kako pomoću ključne reči `repeat` kažeš Jikiju da izvrši kod unutar vitičastih zagrada određeni broj puta."
en_md5: 8ae468aa2be428f22b6eef47b3bdea68
---

Do sada je sve bilo napisano linearno: Jiki prati svaku instrukciju redom, od vrha ka dnu.

Sada ćemo pogledati kako Jiki može da izađe iz tog strogog toka od vrha ka dnu, tačnije kako možemo da mu kažemo da izvrši isti deo koda mnogo puta zaredom.

Na primer, zamisli da si u lavirintu i želiš da se pomeriš 10 koraka napred. Za to postoji funkcija `walk`, ali šta ako ona ne postoji? Šta ako ti je na raspolaganju samo funkcija `move` (pomeri se)?

Umesto da pišemo `move` 10 puta zaredom, što brzo postaje veoma zamorno, treba nam način da kažemo: „Hej, Jiki, uradi sledeće što kažem 10 puta.

`Move`.“

Da bismo ovo uradili u kodu, potrebna nam je naša prva ključna reč (engl. _keyword_). Ključne reči su instrukcije koje Jiki razume. Malo liče na mašine, ali to nisu. Kada Jiki vidi ključnu reč, ne traži mašinu na polici, već jednostavno zna šta treba da uradi. To mu je ugrađeno u mozak. Tokom kursa naučićemo dvadesetak različitih ključnih reči, a prva od njih je ključna reč `repeat`.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-keywords-2.webp"
  alt="Jiki okružen ključnim rečima kao što su repeat, if, else, and i or, uz napomenu da su ključne reči instrukcije koje Jiki razume"
  width="358"
  height="400"
/>

Ključna reč `repeat` radi tačno ono što sam gore rekao. Ona govori Jikiju: „Ponovi ovoliko puta ono što sledeće kažem.“ Pogledaj ovaj kod. Prvo koristimo ključnu reč `repeat` da kažemo Jikiju da će nešto raditi više puta. Zatim u obične zagrade upišemo koliko puta želimo da Jiki to ponovi, a onda otvaramo vitičaste zagrade i unutar njih pišemo ono što želimo da Jiki ponavlja. Ovaj šablon je neverovatno čest u programiranju: navedemo ključnu reč, obično uz neku informaciju (u ovom slučaju koliko puta nešto treba uraditi), a zatim blok koda (engl. _code block_) u vitičastim zagradama. Vratimo se u svet lavirinta: umesto da pišemo `move`, `move`, `move`, `move`, možemo da napišemo „ponovi četiri puta `move`“.

```javascript
repeat(4) {
  move()
}
```

Jiki će videti taj kod i upotrebiće mašinu `move` četiri puta zaredom.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/jiki-running-loop.webp"
  alt="Jiki koristi mašinu move četiri puta zaredom, jedno za drugim"
  width="421"
  height="400"
/>

A nismo ograničeni ni na samo jednu stvar u tim vitičastim zagradama. Jiki može više stvari da radi iznova. Možemo mu reći da uradi `move`, pa `turnLeft`, i da sve to zajedno ponovi četiri puta. Ako Jiki vidi ovo, upotrebiće mašinu `move`, pa mašinu `turnLeft`, pa mašinu `move`, pa mašinu `turnLeft`, pa mašinu `move`, i tako dalje, dok obe ne uradi po četiri puta.

```javascript
repeat(4) {
  move()
  turnLeft()
}
```

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/if-else-code.webp"
  alt="Jiki koristi mašinu move pa mašinu turnLeft, ponavljajući taj par radnji četiri puta"
  width="500"
  height="390"
/>

Ove instrukcije za ponavljanje zovemo petlje (engl. _loops_), i postoji mnogo različitih petlji koje možemo da koristimo, a svaka radi malo drugačije.

Još jedna važna stvar: kada radiš sa petljama, bitno je da ti kod bude uredan. Kada tvoj kod ima dobru vizuelnu strukturu, lako je videti šta se dešava. Ali ako nema, ako zaboraviš da lepo uvučeš redove ili pomešaš uvlačenje, stvari vrlo brzo postanu zbunjujuće. Zato na ovom kursu imamo pravilo. Početnu vitičastu zagradu uvek stavljaš u isti red sa `repeat` naredbom (engl. _statement_). Završnu vitičastu zagradu uvek stavljaš u zaseban red posle naredbe, a kod između njih uvek uvlačiš za dva razmaka. Tako će sve ostati zaista uredno, a ako zaboraviš ili pokušaš da pratiš drugačiji šablon, dobićeš grešku.

<img
  class="concept-image"
  src="/static/images/concept-assets/repeat/multiple-things-in-loop.webp"
  alt="Jiki pokazuje na uvlačenje i novi red koji drže blok koda petlje urednim"
  width="500"
  height="398"
/>
