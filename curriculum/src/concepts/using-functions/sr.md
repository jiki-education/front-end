---
title: "Korišćenje funkcija"
description: "Kaži Jikiju da pokrene jednu od svojih malih mašina: napiši njeno ime, a zatim dve zagrade."
en_md5: 007a425ced42fd3550bfdf9fe6f7b391
---

Kada pišeš kod, ono što u stvari radiš je da na jeziku koji računar razume saopštavaš šta želiš da se dogodi. Postoji mnogo različitih programskih jezika i mnogo različitih interpretera koji uzimaju ono što napišeš i pretvaraju ga u jedinice i nule koje računar razume. Na ovom kursu tvoj interpreter je Jiki. Ceo kurs je dobio ime po njemu. Ovo je Jiki. Jiki će ti biti prijatelj na ovom programerskom putovanju. Njegov posao je da interpretira kod koji pišeš i pretvori ga u jedinice i nule sa kojima računar zaista može da radi.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, prijateljski interpreter koji će te voditi kroz ovaj kurs"
  width="421"
  height="400"
/>

Suština programiranja je u tome da interpreteru, u ovom slučaju Jikiju, daš prave instrukcije, a postoji mnogo različitih instrukcija koje možeš da mu daš, mnogo onih koje on razume. Može da spaja stvari, može nešto da uradi mnogo puta, može da kaže: „Ako se ovo dogodi, onda treba da uradim ovo." Može da pamti stvari i da ih kasnije ponovo upotrebi. Može da ti prijavi grešku (engl. _error_) ako nešto nije u redu. Sve ovo ćemo obraditi na kursu. Ali najvažnije je da razumeš da se sve što ćeš raditi svodi na to da na tablu ispisuješ instrukcije, a Jiki dolazi i prati ih.

Kada sam pre 34 godine učio da programiram, ovo je mentalni model koji sam izgradio, i to je onaj koji i danas imam. Razumem kako računari rade, sve do jedinica i nula, ali iskreno, nikada ne razmišljam o tome. U mojoj glavi, u računaru živi mali čovek, a ja mu kažem šta da radi. Zato pođi sa mnom u ovome. To je snažan mentalni model koji možeš da izgradiš, i ako počneš da razmišljaš na ovaj vizualan način, o tome šta radi taj čovek u računaru, to će ti mnogo pomoći dok učiš da programiraš.

Hajde da počnemo tako što ćemo pogledati jedan od osnovnih pojmova u programiranju, funkcije (engl. _functions_). Funkcije su kao male mašine koje možeš da kažeš Jikiju da upotrebi, i ako zavirimo u Jikijevo skladište, tu se on obično nalazi, videćeš da ima policu sa tri različite mašine: `move` (pomeri se), `turnLeft` (skreni levo) i `turnRight` (skreni desno).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Polica u Jikijevom skladištu na kojoj stoje tri mašine: move, turnLeft i turnRight"
  width="500"
  height="371"
/>

Kada napišeš `move`, a zatim te dve zagrade, time govoriš Jikiju da uzme mašinu `move` sa police, okrene ručicu, upali je i upotrebi.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki dokotrlja mašinu move sa police da bi je upotrebio"
  width="439"
  height="400"
/>

Kada napišeš `turnLeft`, a zatim zagrade, govoriš Jikiju da uzme mašinu `turnLeft` sa police i upotrebi je. To je šablon koji ćeš koristiti ponovo i ponovo. Kad god želiš da upotrebiš neku mašinu, napisaćeš njeno ime, a zatim te zagrade, i to kaže Jikiju da donese mašinu i upotrebi je:

```javascript
move()
turnLeft()
```

Kako ta mašina zaista radi, šta se dešava unutar nje, o tome za sada ne moramo da brinemo. Time ćemo se mnogo detaljnije pozabaviti kasnije. Zapravo, uskoro ćeš imati priliku i da napraviš svoje sopstvene mašine. Ali za sada, ne brini o tome. Za svaku vežbu ćeš dobiti informaciju o tome koje mašine se nalaze na Jikijevoj polici. Za svaku vežbu će biti različite, i njima ćeš rešavati vežbe.
