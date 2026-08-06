---
title: "String-sablonok"
description: "Backtickek és `${...}` helyőrzők használatával az értékek egyenesen a stringbe kerülnek, ahelyett hogy a darabokat `+` jellel fűznénk össze."
en_md5: 7fd0e09ac3b32db5f159f8e772872104
---

Létezik valami, amit _template literalnak_ hívnak: ezzel stringeket illeszthetünk be más stringekbe.

Vagyis ahelyett, hogy a stringeket összeadnánk, készíthetünk egy olyan stringet, egyfajta sablont, amelyben helyet hagyunk más stringeknek.

Ehhez idézőjelek helyett _backticket_ (`` ` ``) használunk.

A backtick, ahogy az angol neve is mutatja, egy visszafelé dőlő vesszőcske. Könnyen lehet, hogy még sosem használtad, ezért először meg kell keresned hozzá a megfelelő billentyűt a billentyűzeteden.

Ezzel hozzuk létre a sablont, amelybe más stringek is kerülhetnek. Ahhoz pedig, hogy egy stringet beillesszünk a sablonba, egy másik furcsa szintaxist használunk: dollárjelet és kapcsos zárójelet. Ha például ugyanazt szeretnénk elérni, mint az imént látott `"hello " + name` összefűzés, azt írhatjuk, hogy `` `hello ${name}` ``.

```javascript
`hello ${name}` // "hello Jeremy" or "hello Jiki"
```

<img
  class="concept-image"
  src="/static/images/concept-assets/string-templates/jiki-name-box.webp"
  alt="Jiki egy name feliratú dobozt tart, ennek értéke kerül be a sablonba"
  width="207"
  height="400"
/>

És pontosan ugyanazt csinálja, mintha a stringeket összeadnánk.

Amikor viszont több stringet kell egyetlen szövegbe beilleszteni, ez sokkal hatékonyabb tud lenni.

Kell egy kis idő, mire ezt a pontos szintaxist megszokod, de igazából nincs benne semmi bonyolult.
