---
title: "Ostatak"
description: "Korišćenje operatora `%` za dobijanje ostatka nakon deljenja; često se koristi za proveru da li je broj paran ili neparan."
en_md5: fe49222bd3f3a019dd9f74a960c5dede
---

Do sada smo koristili sabiranje, oduzimanje, množenje i deljenje kada radimo aritmetiku. Sada ćemo uvesti još jedan, operator ostatka (engl. _remainder_).

Operator ostatka ti daje ostatak, logično, kada podeliš dva broja, a pišemo ga znakom procenta. Dakle, ako napišemo:

```javascript
10 % 4 // 2
```

kažemo, ili pitamo: „Šta ostaje kada podelimo 10 sa 4?“ A odgovor je dva. Zamisli da imaš 10 bombona ili orašastih plodova i želiš da ih jednako podeliš među četvoro ljudi. Svako dobija po dva, a na kraju preostaju dva. I taj deo koji je preostao, to je ostatak. To ti daje ovaj znak procenta.

<img
  class="concept-image"
  src="/static/images/concept-assets/modulo/sharing-candies.webp"
  alt="Niz od deset bombona koji se jednako dele među četvoro ljudi, pri čemu dva ostaju kao ostatak"
  width="500"
  height="22"
/>

Jedan od razloga zašto ovo redovno koristimo u kodu jeste taj što možemo da saznamo da li se nešto deli jednako ili ne, a najčešći obrazac koji ćeš videti uz to jeste provera da li je broj paran ili neparan. Parni brojevi se, kao što znaš, dele sa dva bez ostatka. Svi neparni brojevi prilikom deljenja sa dva imaju jedan kao ostatak na kraju.

Dakle, ako uzmeš četiri, šest ili osam, ako ih podeliš sa dva, svi oni nemaju ostatak, dok pet, sedam i devet, kada ih podeliš sa dva, svi na kraju imaju jedan kao ostatak. Zato kada napišemo `if something % 2 === 0`, kažemo: „Da li je ovo paran broj?“ A to može biti korisno za mnogo stvari. Zamisli da praviš pruge različitih boja ili deliš red na pola, šaljući svaku osobu jednim od dva puta dok ti prilaze.

Još jedna stvar: mogao bi čuti da ljudi ovu ključnu reč „ostatak“ nazivaju modulo operator. Modulo i ostatak su u suštini identični. Postoje neke male razlike zbog kojih verovatno nikada nećeš morati da brineš, pa ćemo za sada o njemu razmišljati kao o operatoru ostatka, jer je to jednostavno mnogo lakše.
