---
title: "Stringovi"
description: "Delovi teksta u navodnicima (slovo, reč, rečenica ili ceo pasus) koje Jiki zapisuje na papir."
en_md5: 89b04f3849f9388a46734924f35c913c
---

Kada želiš da upotrebiš broj, možeš prosto da ga napišeš i Jiki zna na šta misliš. Ali šta ako želiš da upotrebiš slovo, reč ili rečenicu? Na primer, šta ako bi funkcija `rectangle` (pravougaonik) ili funkcija `circle` (krug) imala dodatni ulaz u kojem navodiš boju? Kako bismo napisali boju da je ubacimo u mašinu? Ako samo napišemo reč `green` (zeleno) ili `blue` (plavo), Jiki će misliti da govorimo o nekoj mašini na policama, pa će reći: „Ne postoji mašina koja se zove green. Ne znam šta da radim.“

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-confused.webp"
  alt="Jiki zbunjeno stoji pored mašine za pravougaonike, sa znacima pitanja iznad glave"
  width="446"
  height="400"
/>

Zato imamo pravilo: kad god treba da upotrebimo tekst, stavljamo ga u navodnike, i to u dvostruke navodnike. A kada nešto staviš u navodnike, Jiki izvadi papir i na njemu napiše sve što staviš u te navodnike, a te papire zovemo _stringovi_ (niske).

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/jiki-writing-green.webp"
  alt="Jiki piše reč green na papiru, koji postaje string"
  width="398"
  height="400"
/>

Stringovi mogu biti pojedinačna slova, reči, rečenice, pasusi, pa čak i cele knjige. Pravilo glasi: ako je tekst, stavljamo ga u navodnike i on postaje string.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/string-examples.webp"
  alt="Tabla sa stringovima različitih dužina u navodnicima: jedno slovo, reč, rečenica i adresa u više redova"
  width="500"
  height="398"
/>

Dakle, ako želimo plavi pravougaonik, napisaćemo broj za njegovu levu poziciju, gornju poziciju, širinu i visinu. A za peti ulaz napisaćemo `"blue"` pod navodnicima.

```javascript
rectangle(10, 20, 30, 40, "blue")
```

Jiki bi skinuo mašinu sa police i ubacio novčiće u prva četiri otvora. Zatim bi na papiru napisao blue, ubacio taj papir u peti otvor i pokrenuo mašinu.

<img
  class="concept-image"
  src="/static/images/concept-assets/strings/rectangle-blue-slot.webp"
  alt="Jiki ubacuje papir sa rečju blue u peti otvor mašine za pravougaonike, dok su novčići 10, 20, 30 i 40 u prva četiri otvora"
  width="500"
  height="392"
/>

Reč string jedna je od onih tehničkih reči koje ljudima na prvi pogled deluju pomalo zastrašujuće, ali zapravo znači samo tekst. Vrlo brzo ćeš se navići. Nema u tome ničeg magičnog.
