---
title: "Använda flera funktioner tillsammans"
description: "Dela upp ett problem i små funktioner med ett enda ansvar som anropar varandra, så att varje del förblir enkel och återanvändbar."
en_md5: 7df3110b30c0f279d7f04d3b4e331a99
---

Hittills har de funktioner du har skrivit i stort sett stått på egna ben och innehållit all logik de behöver för att fungera.

Nu ska vi titta på hur du kan dela upp funktioner, så att vi får mindre funktioner som jobbar tillsammans i stället för stora funktioner där det händer mycket på en gång.

En bra tumregel i programmering är att varje funktion ska göra så lite som möjligt. Vi säger att en funktion ska ha ett enda ansvar (_single responsibility_ på engelska). Varje funktion ska alltså bara göra en sak och använda andra funktioner för de olika delmomenten.

Nu tittar vi på ett exempel.

Tänk dig att vi har en funktion vars jobb är att returnera en sträng som beskriver ett namn.

En enkel version skulle se ut så här. Vi har en loop som räknar, något du redan har skrivit, och sedan en strängmall som sätter ihop resultatet.

```javascript
function describeName(name) {
  let length = 0
  for (const letter in name) {
    length += 1
  }
  return `This name is ${length} letters long`
}
```

Det här fungerar fint, men funktionen gör två saker. Dels en ganska generell sak, att räkna, dels en väldigt specifik sak, att bygga upp den här strängen i ett visst format.

Det vore mycket snyggare att dela upp det här i två funktioner: en som ansvarar för räknandet och en som ansvarar för att beskriva ett namn i just det här formatet.

```javascript
// Räknar bara bokstäver
function countLetters(str) {
  let count = 0
  for (const letter in str) {
    count += 1
  }
  return count
}

// Formaterar bara texten snyggt
function describeName(name) {
  const count = countLetters(name)
  return `The name has ${count} letters`
}
```

Sedan kan vi återanvända den generella räknefunktionen i strängformateringen, men också överallt annars där vi behöver den. När vi behöver räkna bokstäver i en sträng är det helt frikopplat från allt som har med utskriften att göra.

Du kan läsa varje funktion för sig och direkt förstå vad den gör.

När dina funktioner blir mer komplexa och fler till antalet är den här tekniken skillnaden mellan prydlig, läsbar kod och totalt kaos.

En sak är värd att nämna igen här: det du skapar inuti en funktion kan inte nås av andra funktioner om du inte medvetet returnerar det.

Om du försöker använda variabeln `count` (antal) inifrån `describeName` (beskriv namnet) går det alltså inte, eftersom den tillhör den andra funktionen.

<img
  class="concept-image"
  src="/static/images/concept-assets/function-composition/jiki-thinking.webp"
  alt="Jiki som funderar, med en glödlampa ovanför huvudet, på hur variabler förblir privata för varje funktion"
  width="361"
  height="353"
/>

I JavaScript kan vi skapa variabler högst upp, ovanför allt annat, som delas mellan funktioner, men jag rekommenderar verkligen att du låter bli om du inte har ett riktigt bra skäl.

Ju mer du håller varje funktion oberoende, det tekniska ordet för det är ren (_pure function_ på engelska), rena funktioner, desto snyggare blir din kod och desto färre buggar skapar du.
