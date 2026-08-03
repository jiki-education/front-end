---
title: "Indata till funktioner"
description: "Stoppa in värden i en funktions inkast för att ändra vad den gör varje gång den körs."
en_md5: 0bd82377f2407de5fe030511752d5503
---

En av de mer kraftfulla sakerna med maskiner, alltså med funktioner, är att många av dem låter dig stoppa in information i dem, och den informationen ändrar vad de gör när du kör dem.

Hittills har vi sett maskiner som ser ut lite som lådor, till exempel maskinen `move` (flytta).

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/move-machine.webp"
  alt="Maskinen move, en vanlig låda utan inkast"
  width="322"
  height="400"
/>

Men vissa maskiner har inkast, som den här maskinen `walk` (gå). `walk`-maskinen är precis som `move`-maskinen. Den flyttar figuren (_character_ på engelska) framåt, men Jiki kan använda inkastet för att ange hur många steg din figur ska gå. Så i stället för att behöva använda funktionen `move` tre gånger i rad, `move`, `move`, `move`, kan du nu bara använda funktionen `walk` och säga åt Jiki att stoppa in talet tre i maskinen.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/walk-machine-slot.webp"
  alt="Maskinen walk, med ett inkast på ovansidan för antalet steg"
  width="481"
  height="400"
/>

För att göra det här i kod skriver vi fortfarande funktionens namn, i det här fallet `walk`, och vi skriver fortfarande vår inledande parentes. Men före den avslutande parentesen anger vi vad vi vill att indata (_input_ på engelska) ska vara. I det här fallet vill vi att indata ska vara tre, alltså att `walk` ska gå tre steg framåt:

```javascript
walk(3)
```

När Jiki ser det tar han talet tre, och du kan tänka på det talet som ett litet mynt. Han stoppar in det i maskinens inkast innan han vevar igång den.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/jiki-coin-into-slot.webp"
  alt="Jiki släpper ner talet 3 som ett mynt i walk-maskinens inkast och vevar sedan igång den"
  width="421"
  height="400"
/>

För funktioner som ritar rektanglar och cirklar behöver du säga åt Jiki att stoppa in flera olika tal, som anger sådant som hur långt från vänsterkanten den ska vara, hur långt från överkanten den ska vara, hur bred en rektangel ska vara och hur hög den ska vara.

I Jikis värld är det bara olika inkast, ett för varje tal.

<img
  class="concept-image"
  src="/static/images/concept-assets/using-functions-with-inputs/two-machines-inputs.webp"
  alt="Rektangelmaskinen med inkast för left, top, width och height, och cirkelmaskinen med inkast för cx, cy och radius"
  width="396"
  height="400"
/>

I koden skriver vi alltså bara varje tal med ett kommatecken emellan. Funktionens namn, en parentes, ett tal för varje indata, alla åtskilda med kommatecken, och sedan avslutar vi med en parentes:

```javascript
rectangle(10, 20, 30, 40)
```

Om du försöker använda en funktion med fel antal indata får du ett fel. Om du till exempel försöker stoppa in indata i en maskin som inte har något inkast säger Jiki till att det inte går. Och om du använder en maskin som har ett inkast men inte talar om för Jiki vad han ska stoppa i det, då stannar han också och klagar. Testa själv om du känner dig lite rebellisk och se vad som händer. Du kommer att göra många sådana här misstag när saker blir mer komplicerade. Försök att inte bli stressad eller ledsen över det. Vi lär oss alla av våra misstag. Det är faktiskt det snabbaste sättet för hjärnan att verkligen ta till sig saker. Och alla gör de här misstagen. Vi har alla börjat från noll, så stressa inte.

En sak till som är värd att nämna: ibland kommer du att se rader i övningar som börjar med två snedstreck, `//`. De kallas kommentarer (_comments_ på engelska). De är privata anteckningar bara för dig, som Jiki helt ignorerar. Så om Jiki ser en rad som börjar med de här två snedstrecken kliver han bara över den och går vidare till nästa rad. Kommentarer ger dig ett sätt att skriva egna anteckningar till dig själv. De är väldigt användbara för att påminna dig om hur saker fungerar. Ofta finns det också färdigskrivna kommentarer, så att när du börjar en övning kan de föreslå var du behöver skriva kod eller hur du kan lösa något. Men lägg gärna till egna kommentarer också.

Längst ner i en övnings instruktioner ser du information om vilka funktioner du kan använda och exakt vilka indata du behöver stoppa in.
