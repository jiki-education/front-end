---
title: "String-sablonok"
description: "Backtickek és `${...}` helyőrzők használatával az értékek egyenesen a stringbe kerülnek, ahelyett hogy a darabokat `+` jellel fűznénk össze."
en_md5: 1e57a04aedaf18c2fde4846476af7f36
---

Létezik valami, amit template literalnak hívnak: ezzel stringeket (karakterláncokat) illeszthetünk be más stringekbe.

Vagyis ahelyett, hogy a stringeket összeadnánk, készíthetünk egy olyan stringet, egyfajta sablont, amelyben helyet hagyunk más stringeknek.

Ehhez idézőjelek helyett backticket használunk.

A backtick, ahogy az angol neve is mutatja, egy visszafelé dőlő vesszőcske. Könnyen lehet, hogy még sosem használtad, ezért először meg kell keresned hozzá a megfelelő billentyűt a billentyűzeteden.

Ezzel hozzuk létre a sablont, amelybe más stringek is kerülhetnek. Ahhoz pedig, hogy egy stringet beillesszünk a sablonba, egy másik furcsa írásmódot használunk: dollárjelet és kapcsos zárójelet. Ha például ugyanazt szeretnénk elérni, mint az imént látott `"hello " + name` összefűzés, azt írhatjuk, hogy `` `hello ${name}` ``.

```javascript
`hello ${name}`
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki egy name feliratú dobozt tart, ennek értéke kerül be a sablonba"
  width="207"
  height="400"
/>

Leírva ez sokkal jobban néz ki, mint ahogy elmondva hangzik.

És pontosan ugyanazt csinálja, mintha a stringeket összeadnánk.

Amikor viszont több stringet kell egyetlen szövegbe beilleszteni, ez sokkal hatékonyabb tud lenni.

Kell egy kis idő, mire ezt a pontos írásmódot megszokod, de igazából nincs benne semmi bonyolult.
