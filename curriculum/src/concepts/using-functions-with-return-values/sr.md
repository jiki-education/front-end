---
title: "Funkcije koje vraćaju stvari"
description: "Kako uhvatiti vrednost koja iskače iz izlaznog otvora funkcije i iskoristiti je u kodu."
en_md5: 830f19fb6aaf184c1f32ade792b60a12
---

Dosad smo gledali funkcije koje rade nešto u svetu. Tako funkcija `circle` (krug) crta krug. Funkcija `move` (pomeranje) pomera tvog lika. Ali neke funkcije rade drugačije. Umesto da rade nešto spolja, daju ti nešto nazad što možeš da koristiš unutar svog koda. Kada funkcija Jikiju vrati nešto što može da koristi u kodu, kažemo da ta funkcija vraća (engl. _return_) nešto. To nešto vraća nazad Jikiju. Možeš da zamisliš ove mašine kao da imaju izlazni otvor. Već imamo ulazne otvore u koje stavljamo stvari, ali možemo imati i jedan izlazni otvor ili otvor kroz koji nešto može da izađe nazad. Kada Jiki pritisne dugme na mašini, mašina se pokreće i nešto će iskočiti iz tog otvora na kraju. To može biti broj. To može biti string. To je nešto što Jiki može da uhvati i koristi.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/machine-with-return-chute.webp"
  alt="Mašina sa izlaznim otvorom na boku, spremna da pošalje vrednost nazad Jikiju"
  width="500"
  height="317"
/>

Većina funkcija, verovatno 95% njih, nešto vraća. Mogu da ti urade neku matematiku i vrate vrednost, ili da spoje nekoliko stringova i onda ti daju rezultujući string. Ili ti možda vrate trenutno vreme svaki put kada pokreneš tu mašinu. Hajde da pogledamo ovaj poslednji slučaj. Recimo da imamo funkciju koja se zove `getCurrentTime` (dohvatanje trenutnog vremena). Svaki put kada Jiki pokrene mašinu, parče papira isklizne iz izlaznog otvora na kome piše vreme, možda 14:35.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/paper-out-of-chute.webp"
  alt="Mašina getCurrentTime sa parčetom papira na kome piše 14:35 koje isklizava iz njenog izlaznog otvora"
  width="500"
  height="312"
/>

A onda možemo tu vraćenu vrednost da stavimo u kutiju koristeći `let`:

```javascript
let time = getCurrentTime()
```

Jiki će pokrenuti mašinu, dobiti trenutno vreme iz otvora i smestiti ga u kutiju koja se zove `time`.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-return-values/jiki-boxing-time.webp"
  alt="Jiki stavlja papir sa 14:35 iz otvora u kutiju sa oznakom time"
  width="372"
  height="400"
/>

Sada je važno razumeti da je parče papira koje Jiki stavi u kutiju fiksirano u tom trenutku. Čak i ako se stvarno vreme promeni dok se tvoj program izvršava, kutija i dalje sadrži onaj papir na kome piše 14:35. Kada se nešto nađe u kutiji, to je fiksna stvar. Ne menja se magično. Ako u budućnosti ponovo želimo da stavimo trenutno vreme u kutiju, moramo ponovo da iskoristimo funkciju `getCurrentTime` da bismo ga dobili.

Većina funkcija koje nešto vraćaju takođe imaju ulaze. Na primer, možemo imati funkciju `join` (spajanje) koja prima dva stringa kao ulaze i vraća ih spojene sa razmakom. Dakle, ako koristimo mašinu `join` sa `"Hello"` i `"World"` kao ulazima, iz otvora će izaći jedan string na kome piše `"Hello World"`.

```javascript
join("Hello", "World"); // "Hello World"
```
