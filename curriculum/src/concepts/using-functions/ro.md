---
title: "Folosirea funcțiilor"
description: "Îi spui lui Jiki să pornească una dintre mașinile lui mici scriindu-i numele urmat de două paranteze."
en_md5: fc671310093a081113a8f301b6ff53fe
---

Când scrii cod, ceea ce faci de fapt este să comunici ce vrei să se întâmple, într-un limbaj pe care calculatorul îl înțelege. Există foarte multe limbaje de programare diferite și foarte multe interpretoare care iau ce scrii tu și transformă totul în șirurile de 0 și 1 pe care calculatorul le poate înțelege. În cursul acesta, interpretorul tău este Jiki. Tot cursul îi poartă numele. El este Jiki. Jiki îți va fi prieten în călătoria asta prin programare. Treaba lui este să interpreteze codul pe care îl scrii și să îl transforme în 0 și 1, ca să poată calculatorul chiar să facă ceva cu el.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-introduction.webp"
  alt="Jiki, interpretorul prietenos care te va ghida pe tot parcursul acestui curs"
  width="421"
  height="400"
/>

Tot rostul programării este să îi dai interpretorului, adică lui Jiki, instrucțiunile potrivite. Și îi poți da lui Jiki o mulțime de instrucțiuni diferite, o mulțime pe care le înțelege. Poate să lipească lucruri unele de altele, poate să facă ceva de foarte multe ori, poate să spună: „Dacă se întâmplă asta, atunci trebuie să fac asta”. Poate să țină minte lucruri și să le folosească mai târziu. Îți poate da o eroare dacă ceva nu e în regulă. Le vom lua pe rând pe toate în cursul acesta. Dar lucrul esențial de înțeles este că tot ce vei face de acum înainte înseamnă să pui instrucțiuni pe o tablă, iar Jiki vine și le urmează.

Când am învățat eu să programez, acum 34 de ani, acesta a fost modelul mental pe care mi l-am construit și este același pe care îl am și azi. Înțeleg cum funcționează calculatoarele până la nivelul de 0 și 1, dar sincer, nu mă gândesc niciodată la asta. În mintea mea, în calculator trăiește un omuleț și eu îi spun ce să facă. Așa că vino și tu cu mine în ideea asta. Este un model mental puternic, pe care ți-l poți construi și tu, și dacă începi să te gândești atât de vizual la ce face omul din calculator, o să îți prindă foarte bine pe măsură ce înveți să programezi.

Hai să începem cu una dintre noțiunile fundamentale din programare: funcțiile (engl. _functions_). Funcțiile sunt ca niște mașini mici pe care îi poți spune lui Jiki să le folosească. Iar dacă ne uităm în depozitul lui Jiki, acolo unde își petrece timpul, o să vezi că are un raft cu trei mașini diferite pe el: `move` (mișcă-te), `turnLeft` (întoarce-te la stânga) și `turnRight` (întoarce-te la dreapta).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/warehouse-three-machines.webp"
  alt="Un raft din depozitul lui Jiki cu trei mașini pe el, etichetate move, turnLeft și turnRight"
  width="500"
  height="371"
/>

Când ai scris `move` și apoi cele două paranteze, ceea ce ai făcut a fost să îi spui lui Jiki să ia mașina `move` de pe raft, să învârtă manivela, să o pornească și să o folosească.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions/jiki-using-move-1.webp"
  alt="Jiki coboară mașina move de pe raft ca să o folosească"
  width="439"
  height="400"
/>

Când ai scris `turnLeft` și apoi parantezele, i-ai spus lui Jiki să ia mașina `turnLeft` de pe raft și să o folosească. Și acesta este tiparul pe care îl vei folosi iar și iar: ori de câte ori vrei să folosești o mașină, îi scrii numele și apoi parantezele acelea, iar asta îi spune lui Jiki să meargă să ia mașina și să o folosească:

```javascript
move()
turnLeft()
```

Cum funcționează de fapt mașina aceea, ce se întâmplă înăuntrul ei, nu trebuie să ne batem capul deocamdată. O să vedem asta mult mai în detaliu mai târziu. De fapt, nu va trece mult până când vei putea să-ți construiești și propriile mașini. Dar deocamdată, nu-ți face griji pentru asta. La fiecare exercițiu ți se va spune ce mașini sunt pe raftul lui Jiki. Vor fi altele pentru fiecare exercițiu și le vei putea folosi ca să rezolvi exercițiile.
